<template>
    <div
        ref="slider"
        class="slider"
    >
        <base-slider-inner
            ref="sliderInner"
            v-model="internalActive"
            @updateItems="items = $event"
        >
            <base-slider-slide
                v-for="(_, index) in $slots"
                :key="index"
            >
                <slot :name="index" />
            </base-slider-slide>
        </base-slider-inner>

        <template v-if="hasControls">
            <button
                type="button"
                class="btn btn-primary slider-control-prev"
                :disabled="controls !== 'screen' ? !hasBtn.itemPrev : !hasBtn.screenPrev"
                @click="controls !== 'screen' ? goToItemPrev() : goToScreenPrev()"
            >
                <span
                    class="slider-control-prev-icon"
                    aria-hidden="true"
                />
                <span class="visually-hidden">←</span>
            </button>

            <button
                type="button"
                class="btn btn-primary slider-control-next"
                :disabled="controls !== 'screen' ? !hasBtn.itemNext : !hasBtn.screenNext"
                @click="controls !== 'screen' ? goToItemNext() : goToScreenNext()"
            >
                <span
                    class="slider-control-next-icon"
                    aria-hidden="true"
                />
                <span class="visually-hidden">→</span>
            </button>
        </template>

        <ul
            v-if="indicators"
            class="slider-indicators"
        >
            <template v-if="indicators !== 'screen'">
                <li
                    v-for="(item, index) in items"
                    :key="`items-${index}`"
                    :class="{ 'active': item.inView }"
                >
                    <a
                        :href="`#item-${index}`"
                        @click.prevent="goTo(index)"
                    >
                        {{ index }}
                    </a>
                </li>
            </template>
            <template v-else>
                <li
                    v-for="(_, index) in screensLength"
                    :key="`screens-${index}`"
                    :class="{ 'active': screensInView.has(index) }"
                >
                    <button
                        type="button"
                        @click="goTo(index, 'screen')"
                    >
                        {{ index }}
                    </button>
                </li>
            </template>
        </ul>

        <div v-if="false" class="debugging">
            <ul class="list-inline text-center">
                <li
                    v-for="(item, index) in items"
                    :key="`items-${index}`"
                    class="list-inline-item"
                >
                    <a
                        :href="`#item-${index}`"
                        class="btn btn-primary"
                        :style="[ item.inView && { background: 'red' }]"
                        @click.prevent="goTo(index)"
                    >
                        {{ `${index} - ${item.screen}` }}
                    </a>
                </li>
            </ul>

            <ul class="list-inline text-center">
                <li
                    v-for="(_, index) in screensLength"
                    :key="`screens-${index}`"
                    class="list-inline-item"
                >
                    <button
                        type="button"
                        class="btn btn-primary"
                        :style="[ screensInView.has(index) && { background: 'red' }]"
                        @click="goTo(index, 'screen')"
                    >
                        {{ index }}
                    </button>
                </li>
            </ul>

            <div class="d-flex">
                <pre class="items">{{ items }}</pre>
                <div>
                    <pre v-if="itemInViewFirst">{{
                        `items ${itemInViewFirst.index + 1}/${itemsLength}`
                    }}</pre>
                    <pre v-if="screenInViewFirst >= 0">{{
                        `screens ${screenInViewFirst + 1}/${screensLength}`
                    }}</pre>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BaseSliderInner from '~/components/BaseSliderInner.vue';
import BaseSliderSlide from '~/components/BaseSliderSlide.vue';

export default {
    name: 'BaseSlider',

    components: {
        BaseSliderInner,
        BaseSliderSlide,
    },

    model: {
        prop: 'active',
        event: 'active:change',
    },

    props: {
        active: {
            type: Number,
            default: 0,
        },
        controls: {
            type: [Boolean, String],
            default: true,
        },
        infinite: {
            type: Boolean,
            default: true,
        },
        indicators: {
            type: [Boolean, String],
            default: false,
        },
        interval: {
            type: [Boolean, Number],
            default: false,
        },
    },

    data: () => ({
        items: {},
        intervalIntervalId: null,
        intervalObserver: null,
    }),

    computed: {
        internalActive: {
            get() { return this.active; },
            set(value) { return this.$emit('active:change', value); },
        },
        itemsLength() {
            return Object.keys(this.items).length;
        },
        itemsInView() {
            const items = Object.values(this.items)
                .filter((item) => item.inView);

            return items || [];
        },
        itemInViewFirst() {
            return this.itemsInView[0];
        },
        itemInViewLast() {
            return this.itemsInView[this.itemsInView.length - 1];
        },
        screensInView() {
            const screens = new Set();
            this.itemsInView.forEach((item) => {
                screens.add(item.screen);
            });

            return screens;
        },
        screenInViewFirst() {
            return this.screensInView.values().next().value;
        },
        screensLength() {
            const [lastItem] = Object.values(this.items).slice(-1);

            if (!lastItem) return null;

            return lastItem.screen + 1;
        },
        hasBtn() {
            const output = {
                itemPrev: null,
                itemNext: null,
                screenPrev: null,
                screenNext: null,
            };

            if (this.infinite) {
                output.itemPrev = true;
                output.itemNext = true;
                output.screenPrev = true;
                output.screenNext = true;
            } else {
                output.itemPrev = this.itemInViewFirst?.index !== 0;
                output.itemNext = this.itemInViewLast?.index + 1 !== this.itemsLength;
                output.screenPrev = this.screenInViewFirst !== 0;
                output.screenNext = this.screenInViewFirst + 1 !== this.screensLength;
            }

            return output;
        },
        hasControls() {
            const itemsNotInView = this.itemsInView.length > 0
                && this.itemsInView.length < this.itemsLength;
            return this.controls && itemsNotInView;
        },
    },

    mounted() {
        const {
            slider,
            sliderInner: { $el: sliderInner },
        } = this.$refs;

        this.goTo(this.active, 'item', this.items, 'auto');
        if (this.interval) this.attachInterval(slider, sliderInner);
    },

    methods: {
        goToWantedEntityValidator(to, entityIndex, entityLength) {
            let wantedEntityIndex = entityIndex;

            const { sliderInner: { $el: sliderInner } } = this.$refs;
            const {
                scrollLeft: sliderScrollLeft,
                scrollWidth: sliderScrollWidth,
                offsetWidth: sliderWidth,
            } = sliderInner;

            let sliderChangedDirection = false;
            const sliderScrollStart = Math.abs(sliderScrollLeft);
            const sliderScrollEnd = sliderScrollStart + sliderWidth;
            const scrollStartFinished = sliderScrollStart === 0 && to === 'prev';
            const scrollEndFinished = sliderScrollEnd === sliderScrollWidth && to === 'next';
            const wantedEntityIndexStartFinished = wantedEntityIndex < 0;
            const wantedEntityIndexEndFinished = wantedEntityIndex + 1 > entityLength;

            if (scrollStartFinished || wantedEntityIndexStartFinished) {
                wantedEntityIndex = entityLength - 1;
                sliderChangedDirection = true;
            } else if (scrollEndFinished || wantedEntityIndexEndFinished) {
                wantedEntityIndex = 0;
                sliderChangedDirection = true;
            }

            if (!this.infinite && sliderChangedDirection) {
                return false;
            }

            return wantedEntityIndex;
        },
        goToWantedEntity(to, entity, items) {
            let wantedEntityIndex = null;

            let direction = null;
            if (to === 'prev') direction = -1;
            else if (to === 'next') direction = +1;

            let entityIndex = null;
            let entityLength = null;
            if (entity === 'item') {
                entityIndex = this.itemInViewFirst.index;
                entityLength = this.itemsLength;
            } else if (entity === 'screen') {
                entityIndex = this.screenInViewFirst;
                entityLength = this.screensLength;
                const itemFromScreenNotInView = Object.values(items)
                    .find((item) => item.screen === entityIndex && !item.inView);

                if (to === 'prev' && itemFromScreenNotInView) {
                    direction = 0;
                }
            }

            wantedEntityIndex = entityIndex + direction;

            return this.goToWantedEntityValidator(to, wantedEntityIndex, entityLength);
        },
        goTo(to, entity = 'item', items = this.items, behavior = 'smooth') {
            let wantedEntityIndex = to;

            if (['prev', 'next'].includes(to)) {
                wantedEntityIndex = this.goToWantedEntity(to, entity, items);
            }

            if (!wantedEntityIndex && wantedEntityIndex !== 0) return false;

            let wantedItem = null;
            if (entity === 'item') wantedItem = items[wantedEntityIndex];
            else if (entity === 'screen') wantedItem = Object.values(items).find((item) => item.screen === wantedEntityIndex);
            const { scrollTo } = wantedItem;

            const { sliderInner: { $el: sliderInner } } = this.$refs;

            if (scrollTo === sliderInner.scrollLeft) return false;

            sliderInner.scrollTo({
                left: scrollTo,
                behavior,
            });

            this.$emit('active:change', wantedItem.index);

            return wantedItem.index;
        },
        goToItemPrev() {
            return this.goTo('prev');
        },
        goToItemNext() {
            return this.goTo('next');
        },
        goToScreenPrev() {
            return this.goTo('prev', 'screen');
        },
        goToScreenNext() {
            return this.goTo('next', 'screen');
        },

        attachInterval(slider, sliderInner) {
            const onIntersection = (entries) => {
                this.clearInterval();

                const { isIntersecting } = entries[0];

                if (!isIntersecting) return;

                this.startInterval();
            };

            this.intervalObserver = new IntersectionObserver(
                onIntersection,
                {
                    threshold: 0.5,
                    thresholds: [0, 0.5, 1],
                },
            );

            this.intervalObserver.observe(sliderInner);
            slider.addEventListener('mouseover', this.clearInterval);
            slider.addEventListener('mouseout', this.startInterval);
        },
        detachInterval(
            slider = this.$refs.slider,
            sliderInner = this.$refs.sliderInner.$el,
        ) {
            this.clearInterval();
            this.intervalObserver?.unobserve(sliderInner);
            slider.removeEventListener('mouseover', this.clearInterval);
            slider.removeEventListener('mouseout', this.startInterval);
        },
        startInterval() {
            const getInterval = typeof this.interval === 'number' ? this.interval : 5000;

            this.intervalIntervalId = setInterval(() => {
                const itemIndex = this.goToItemNext();

                if (itemIndex === false) this.detachInterval();
            }, getInterval);
        },
        clearInterval() {
            clearInterval(this.intervalIntervalId);
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/base-slider";

.debugging {
    margin-top: 20px;
    font-size: 10px;

    pre.items {
        height: 300px;
        overflow-y: scroll;
    }

    > * + * {
        margin-left: 20px;
    }
}
</style>

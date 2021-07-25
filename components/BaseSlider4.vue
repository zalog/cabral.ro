<template>
    <div class="slider">
        <base-slider-4-inner
            ref="sliderInnerRef"
            v-model="internalActive"
            @updateItems="items = $event"
        >
            <base-slider-4-slide
                v-for="(_, index) in $slots"
                :key="index"
            >
                <slot :name="index" />
            </base-slider-4-slide>
        </base-slider-4-inner>

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
    </div>
</template>

<script>
import BaseSlider4Inner from '~/components/BaseSlider4Inner.vue';
import BaseSlider4Slide from '~/components/BaseSlider4Slide.vue';

export default {
    name: 'BaseSlider4',

    components: {
        BaseSlider4Inner,
        BaseSlider4Slide,
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
        indicators: {
            type: [Boolean, String],
            default: false,
        },
    },

    data: () => ({
        items: {},
    }),

    computed: {
        internalActive: {
            get() { return this.active; },
            set(value) { return this.$emit('active:change', value); },
        },
        itemsInView() {
            const items = Object.values(this.items)
                .filter((item) => item.inView);

            return items || [];
        },
        screensInView() {
            const screens = new Set();
            this.itemsInView.forEach((item) => {
                screens.add(item.screen);
            });

            return screens;
        },
        screensLength() {
            const [lastItem] = Object.values(this.items).slice(-1);

            if (!lastItem) return null;

            return lastItem.screen + 1;
        },
    },

    methods: {
        goToWantedEntityValidator(to, entityIndex, entityLength) {
            let wantedEntityIndex = entityIndex;

            const { sliderInnerRef } = this.$refs;
            const sliderInner = sliderInnerRef.$el.querySelector('.slider-inner');
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
        goTo(to, entity = 'item', items = this.items) {
            let wantedEntityIndex = to;

            if (['prev', 'next'].includes(to)) {
                wantedEntityIndex = this.goToWantedEntity(to, entity, items);
            }

            if (!wantedEntityIndex && wantedEntityIndex !== 0) return false;

            let wantedItem = null;
            if (entity === 'item') wantedItem = items[wantedEntityIndex];
            else if (entity === 'screen') wantedItem = Object.values(items).find((item) => item.screen === wantedEntityIndex);
            const { scrollTo } = wantedItem;

            const { sliderInnerRef } = this.$refs;
            const sliderInner = sliderInnerRef.$el.querySelector('.slider-inner');
            sliderInner.scrollTo({
                left: scrollTo,
                behavior: 'smooth',
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
    },
};
</script>

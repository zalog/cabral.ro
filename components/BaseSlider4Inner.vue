<template>
    <div>
        <h2>css + js</h2>

        <div
            ref="slider"
            class="slider"
            style="width: 100%;"
        >
            <div
                ref="sliderInner"
                class="slider-inner"
                :class="innerClass"
            >
                <slot v-if="$slots.default" />
            </div>

            <template v-if="controls">
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
                        v-for="(item, index) in internalItems"
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

        <div v-if="false" class="debugging">
            <ul class="list-inline text-center">
                <li
                    v-for="(item, index) in internalItems"
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
                <pre class="items">{{ internalItems }}</pre>
                <div>
                    <pre>{{ { isDragging, isScrolling } }}</pre>
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
const defaultItem = {
    index: 0,
    width: 0,
    scrollTo: 0,
    screen: 0,
    inView: false,
};

export default {
    name: 'BaseSlider4Inner',

    model: {
        prop: 'active',
        event: 'active:change',
    },

    props: {
        active: {
            type: Number,
            default: 0,
        },
        interval: {
            type: [Boolean, Number],
            default: false,
        },
        infinite: {
            type: Boolean,
            default: true,
        },
        dragging: {
            type: Boolean,
            default: false,
        },
        innerClass: {
            type: [Boolean, String],
            default: 'row',
        },
        controls: {
            type: [Boolean, String],
            default: true,
        },
        indicators: {
            type: [Boolean, String],
            default: false,
        },
    },

    data: () => ({
        isDragging: false,
        isScrolling: false,
        internalItems: {},
        intervalIntervalId: null,
        intervalObserver: null,
    }),

    computed: {
        itemsInView() {
            const items = Object.values(this.internalItems)
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
        // TODO move screensLength to BaseSlider4
        screensLength() {
            const [lastItem] = Object.values(this.internalItems).slice(-1);

            if (!lastItem) return null;

            return lastItem.screen + 1;
        },
        itemsLength() {
            return Object.keys(this.internalItems).length;
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
                output.screenPrev = this.screenInViewFirst === 0;
                output.screenNext = this.screenInViewFirst + 1 === this.screensLength;
            }

            return output;
        },
    },

    watch: {
        active(index) {
            this.goTo(index);
        },
    },

    mounted() {
        const {
            slider,
            sliderInner,
        } = this.$refs;

        this.createStateItems(sliderInner);

        this.attachObserveItems(sliderInner);
        if (this.interval) this.attachInterval(slider, sliderInner);
        this.attachResize(sliderInner);
        if (this.dragging) this.attachDrag(sliderInner);
        this.attachScroll(sliderInner);
    },

    methods: {
        createStateItems(sliderInner) {
            const items = this.prepareItems(sliderInner);

            items.forEach((item, index) => {
                this.$set(this.internalItems, index, item);
            });

            this.$emit('updateItems', this.internalItems);
        },

        updateStateItem(index, payload) {
            this.internalItems[index] = {
                ...this.internalItems[index],
                ...payload,
            };

            this.$emit('updateItems', this.internalItems);
        },

        goToWantedEntityValidator(to, entityIndex, entityLength) {
            let wantedEntityIndex = entityIndex;

            const { sliderInner } = this.$refs;
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
        goTo(to, entity = 'item', items = this.internalItems) {
            let wantedEntityIndex = to;

            if (['prev', 'next'].includes(to)) {
                wantedEntityIndex = this.goToWantedEntity(to, entity, items);
            }

            if (!wantedEntityIndex && wantedEntityIndex !== 0) return false;

            let wantedItem = null;
            if (entity === 'item') wantedItem = items[wantedEntityIndex];
            else if (entity === 'screen') wantedItem = Object.values(items).find((item) => item.screen === wantedEntityIndex);
            const { scrollTo } = wantedItem;

            const { sliderInner } = this.$refs;
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

        attachObserveItems(sliderInner) {
            const items = [...sliderInner.children];
            const onIntersection = (entries) => {
                entries.forEach((entryIO) => {
                    const { target: node } = entryIO;
                    const nodeIndex = Array.from(node.parentNode.children).indexOf(node);

                    this.updateStateItem(nodeIndex, {
                        inView: entryIO.isIntersecting,
                    });
                });
            };
            const observer = new IntersectionObserver(
                onIntersection,
                {
                    root: sliderInner,
                    threshold: 0.5,
                    thresholds: [0, 0.25, 0.5, 0.75, 1],
                },
            );

            items.forEach((item) => {
                observer.observe(item);
            });
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
            sliderInner = this.$refs.sliderInner,
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

        attachResize(sliderInner) {
            let isFirstTime = true;
            const resizeObserver = new ResizeObserver((entries) => {
                if (isFirstTime) {
                    isFirstTime = false;
                    return;
                }

                const { target: resizedSlider } = entries[0];
                const items = this.prepareItems(resizedSlider);

                items.forEach((item, index) => {
                    this.updateStateItem(index, {
                        width: item.width,
                        scrollTo: item.scrollTo,
                        screen: item.screen,
                    });
                });
            });

            resizeObserver.observe(sliderInner);
        },

        attachDrag(sliderInner) {
            const theSliderInner = this.$refs.sliderInner;

            let isMousedown = false;
            let isDragging = false;
            let startX;
            let scrollLeft;

            let momentumID;
            let velX = 0;

            this.onDragging(isDragging);

            const momentumLoop = () => {
                theSliderInner.scrollLeft += velX;
                velX *= 0.95;

                if (Math.abs(velX) < 0.5) return;

                momentumID = window.requestAnimationFrame(momentumLoop);
            };
            const cancelMomentumTracking = () => {
                isDragging = false;
                this.onDragging(isDragging);

                window.cancelAnimationFrame(momentumID);
            };
            const beginMomentumTracking = () => {
                cancelMomentumTracking();
                momentumID = window.requestAnimationFrame(momentumLoop);
            };

            sliderInner.addEventListener('mousedown', (event) => {
                event.preventDefault();

                isMousedown = true;
                isDragging = false;

                this.onDragging(isDragging);

                this.snap({ sliderInner, snap: true });

                startX = event.pageX - sliderInner.offsetLeft;
                scrollLeft = sliderInner.scrollLeft;
                cancelMomentumTracking();
            });

            sliderInner.addEventListener('mouseleave', () => {
                isMousedown = false;
            });

            sliderInner.addEventListener('mouseup', () => {
                isMousedown = false;
                beginMomentumTracking();
            });

            sliderInner.addEventListener('mousemove', (event) => {
                if (!isMousedown) return;

                event.preventDefault();

                isDragging = true;
                this.onDragging(isDragging);

                const x = event.pageX - sliderInner.offsetLeft;
                const walk = (x - startX) * 3;
                const prevScrollLeft = sliderInner.scrollLeft;
                theSliderInner.scrollLeft = scrollLeft - walk;
                velX = sliderInner.scrollLeft - prevScrollLeft;
            });

            sliderInner.addEventListener('wheel', () => {
                cancelMomentumTracking();
            });

            const items = [...sliderInner.children];
            items.forEach((item) => {
                const links = item.querySelectorAll('a');
                links.forEach((link) => {
                    link.addEventListener('click', (event) => {
                        if (isDragging || this.isScrolling) event.preventDefault();
                    });
                });
            });
        },

        attachScroll(sliderInner) {
            let rafID;
            let timeoutID;

            sliderInner.addEventListener('scroll', () => {
                if (rafID) {
                    window.cancelAnimationFrame(rafID);
                    clearTimeout(timeoutID);
                }

                rafID = window.requestAnimationFrame(() => {
                    this.onScrolling(true);

                    timeoutID = setTimeout(() => {
                        this.onScrolling(false);
                    }, 100);
                });
            });
        },

        onDragging(isDragging) {
            this.isDragging = isDragging;
            this.$emit('onDragging', isDragging);
        },

        onScrolling(isScrolling) {
            this.isScrolling = isScrolling;
            this.$emit('onScrolling', isScrolling);
        },

        prepareItems(sliderInner) {
            const { dir } = sliderInner.parentElement;
            const {
                offsetWidth: sliderWidth,
                scrollWidth: sliderScrollWidth,
            } = sliderInner;
            const items = [...sliderInner.children];
            const screens = this.getRanges(sliderWidth, sliderScrollWidth);

            let lastItemScreen = null;

            return items.map((item, index) => {
                const itemPrev = index && items[index - 1];
                let itemPrevEnd = itemPrev ? itemPrev.offsetLeft + itemPrev.offsetWidth : 0;
                const {
                    offsetLeft: itemStart,
                    offsetWidth: itemWidth,
                } = item;
                let itemDir = {
                    itemStart: itemPrevEnd,
                    itemEnd: itemStart + itemWidth,
                };
                let scrollTo = itemDir.itemStart;

                if (dir === 'rtl') {
                    itemPrevEnd = itemPrev ? sliderWidth - itemPrev.offsetLeft : 0;
                    itemDir = {
                        itemStart: itemPrevEnd,
                        itemEnd: sliderWidth - itemStart,
                    };
                    scrollTo = -itemDir.itemStart;
                }

                const getAproxItemScreen = this.getAproxItemScreen({
                    ...itemDir,
                    lastItemScreen,
                    screens,
                });

                lastItemScreen = getAproxItemScreen;

                return {
                    ...defaultItem,
                    index,
                    scrollTo,
                    width: itemWidth,
                    screen: getAproxItemScreen,
                };
            });
        },

        getAproxItemScreen({
            itemStart, itemEnd,
            lastItemScreen,
            screens,
        }) {
            const itemScreen = screens
                .findIndex((screen) => {
                    const itemEndInScreen = itemEnd <= screen.max;
                    const itemStartInScreen = screen.min <= itemStart;
                    const itemStartInPrevScreen = itemStart <= screen.min;
                    const exactMatch = itemStartInScreen && itemEndInScreen;
                    const aproxMatch = itemStartInPrevScreen || itemEndInScreen;
                    return exactMatch || aproxMatch;
                });

            const itemScreenJumped = (itemScreen - lastItemScreen) >= 2;
            const itemScreenNotFound = itemScreen === -1;

            let output = itemScreen;
            if (itemScreenJumped || itemScreenNotFound) {
                output = lastItemScreen + 1;
            }

            return output;
        },

        getRanges(range, total) {
            const size = Math.ceil(total / range);
            const output = [];

            for (let i = 0; i < size; i += 1) {
                const min = (i === 0) ? 0 : (range * i) + 1;
                const getMax = (i === 0) ? range : range * (i + 1);
                const max = (getMax >= total) ? total : getMax;

                output.push({
                    min,
                    max,
                });
            }

            return output;
        },

        snap({ sliderInner, snap }) {
            const verb = snap ? 'add' : 'remove';

            sliderInner.classList[verb]('slider-remove-snap');
        },
    },
};
</script>

<style lang="scss">
@import "../assets/scss/components/slider.scss";

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

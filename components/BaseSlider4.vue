<template>
    <div>
        <h2>css + js</h2>

        <div class="slider" style="width: 100%;">
            <div
                ref="slider-range"
                class="slider-range"
            >
                <div
                    v-for="(range, index) in ranges"
                    :key="index"
                    class="slider-range-item"
                    :style="{ width: `${range.max - range.min}px` }"
                >
                    {{ `${range.min}, ${range.max} / ${index}` }}
                </div>
            </div>
            <div
                ref="slider-inner"
                class="slider-inner"
            >
                <slot v-if="$slots.default" />
            </div>

            <ul class="list-inline text-center">
                <li class="list-inline-item">
                    <button
                        type="button"
                        class="btn btn-primary slider-control-prev"
                        :disabled="hasBtn.itemPrev"
                        @click="goToItemPrev()"
                    >
                        <span class="slider-control-prev-icon" aria-hidden="true" />
                        <span class="visually-hidden">←</span>
                    </button>
                </li>
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
                <li class="list-inline-item">
                    <button
                        type="button"
                        class="btn btn-primary slider-control-next"
                        :disabled="hasBtn.itemNext"
                        @click="goToItemNext()"
                    >
                        <span class="slider-control-next-icon" aria-hidden="true" />
                        <span class="visually-hidden">→</span>
                    </button>
                </li>
            </ul>

            <ul class="list-inline text-center">
                <li class="list-inline-item">
                    <button
                        type="button"
                        class="btn btn-primary slider-control-prev"
                        :disabled="hasBtn.screenPrev"
                        @click="goToScreenPrev()"
                    >
                        <span class="slider-control-prev-icon" aria-hidden="true" />
                        <span class="visually-hidden">←</span>
                    </button>
                </li>
                <li
                    v-for="(_, index) in screensLength"
                    :key="`screens-${index}`"
                    class="list-inline-item"
                >
                    <button
                        type="button"
                        class="btn btn-primary"
                        :style="[ activeScreenIndex === index && { background: 'red' }]"
                        @click="goTo(index, 'screen')"
                    >
                        {{ index }}
                    </button>
                </li>
                <li class="list-inline-item">
                    <button
                        type="button"
                        class="btn btn-primary slider-control-next"
                        :disabled="hasBtn.screenNext"
                        @click="goToScreenNext()"
                    >
                        <span class="slider-control-next-icon" aria-hidden="true" />
                        <span class="visually-hidden">→</span>
                    </button>
                </li>
            </ul>
        </div>
        <div class="d-flex debugging">
            <pre class="items">{{ internalItems }}</pre>
            <pre>{{ ranges }} </pre>
            <div>
                <pre>{{ { isDragging, isScrolling } }}</pre>
                <pre v-if="itemInViewFirst">{{
                    `items ${itemInViewFirst.index + 1}/${itemsLength}`
                }}</pre>
                <pre v-if="activeScreenIndex >= 0">{{
                    `screens ${activeScreenIndex + 1}/${screensLength}`
                }}</pre>
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
    name: 'BaseSlider4',

    props: {
        infinite: {
            type: Boolean,
            default: true,
        },
    },

    data: () => ({
        isDragging: false,
        isScrolling: false,
        internalItems: {},
        ranges: [],
        scrollLeft: 0,
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
        activeScreenIndex() {
            return this.itemInViewFirst?.screen;
        },
        screensLength() {
            const [lastItem] = Object.values(this.internalItems).slice(-1);

            if (!lastItem) return null;

            return lastItem.screen + 1;
        },
        itemsLength() {
            return Object.keys(this.internalItems).length;
        },
        hasBtn() {
            return {
                itemPrev: !this.infinite && this.itemInViewFirst.index === 0,
                itemNext: !this.infinite && this.itemInViewFirst.index + 1 === this.itemsLength,
                screenPrev: !this.infinite && this.activeScreenIndex === 0,
                screenNext: !this.infinite && this.activeScreenIndex + 1 === this.screensLength,
            };
        },
    },

    watch: {
        isDragging(newValue) {
            this.$emit('onDragging', newValue);
        },
        isScrolling(newValue) {
            this.$emit('onDragging', true);
            this.$emit('onScrolling', newValue);
        },
        scrollLeft(newValue) {
            const slider = this.$refs['slider-range'];
            slider.scrollLeft = newValue;
        },
    },

    mounted() {
        const slider = this.$refs['slider-inner'];

        this.createStateItems(slider);

        this.attachObserve(slider);
        this.attachResize(slider);
        this.attachDrag(slider);
        this.attachScroll(slider);
    },

    methods: {
        createStateItems(slider) {
            const items = this.prepareItems(slider);

            items.forEach((item, index) => {
                this.$set(this.internalItems, index, item);
            });
        },

        updateStateItem(index, payload) {
            this.internalItems[index] = {
                ...this.internalItems[index],
                ...payload,
            };
        },

        goTo(to, entity = 'item', items = this.internalItems) {
            let wantedEntityIndex = to;
            const slider = this.$refs['slider-inner'];

            if (['prev', 'next'].includes(to)) {
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
                }

                wantedEntityIndex = entityIndex + direction;

                const {
                    scrollLeft: sliderScrollLeft,
                    scrollWidth: sliderScrollWidth,
                    offsetWidth: sliderWidth,
                } = slider;

                const sliderScrollStart = Math.abs(sliderScrollLeft);
                const sliderScrollEnd = sliderScrollStart + sliderWidth;
                const scrollStartFinished = sliderScrollStart === 0 && to === 'prev';
                const scrollEndFinished = sliderScrollEnd === sliderScrollWidth && to === 'next';
                const wantedEntityIndexStartFinished = wantedEntityIndex < 0;
                const wantedEntityIndexEndFinished = wantedEntityIndex + 1 > entityLength;

                if (scrollStartFinished || wantedEntityIndexStartFinished) {
                    wantedEntityIndex = entityLength - 1;
                } else if (scrollEndFinished || wantedEntityIndexEndFinished) {
                    wantedEntityIndex = 0;
                }
            }

            let wantedItem = null;
            if (entity === 'item') wantedItem = items[wantedEntityIndex];
            else if (entity === 'screen') wantedItem = Object.values(items).find((item) => item.screen === wantedEntityIndex);
            const { scrollTo } = wantedItem;

            slider.scrollTo({
                left: scrollTo,
                behavior: 'smooth',
            });
        },
        goToItemPrev() {
            this.goTo('prev');
        },
        goToItemNext() {
            this.goTo('next');
        },
        goToScreenPrev() {
            this.goTo('prev', 'screen');
        },
        goToScreenNext() {
            this.goTo('next', 'screen');
        },

        attachObserve(slider) {
            const items = [...slider.children];
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
                    root: slider,
                    threshold: 0.5,
                    thresholds: [0, 0.25, 0.5, 0.75, 1],
                },
            );

            items.forEach((item) => {
                observer.observe(item);
            });
        },

        attachResize(slider) {
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
                        screen: item.screen,
                    });
                });
            });

            resizeObserver.observe(slider);
        },

        attachDrag(slider) {
            const theSlider = this.$refs['slider-inner'];

            let isMousedown = false;
            let isDragging = false;
            let startX;
            let scrollLeft;

            let momentumID;
            let velX = 0;

            this.isDragging = isDragging;

            const momentumLoop = () => {
                theSlider.scrollLeft += velX;
                velX *= 0.95;

                if (Math.abs(velX) < 0.5) return;

                momentumID = window.requestAnimationFrame(momentumLoop);
            };
            const cancelMomentumTracking = () => {
                isDragging = false;
                this.isDragging = isDragging;

                window.cancelAnimationFrame(momentumID);
            };
            const beginMomentumTracking = () => {
                cancelMomentumTracking();
                momentumID = window.requestAnimationFrame(momentumLoop);
            };

            slider.addEventListener('mousedown', (event) => {
                event.preventDefault();

                isMousedown = true;
                isDragging = false;

                this.isDragging = isDragging;

                this.snap({ slider, snap: true });

                startX = event.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
                cancelMomentumTracking();
            });

            slider.addEventListener('mouseleave', () => {
                isMousedown = false;
            });

            slider.addEventListener('mouseup', () => {
                isMousedown = false;
                beginMomentumTracking();
            });

            slider.addEventListener('mousemove', (event) => {
                if (!isMousedown) return;

                event.preventDefault();

                isDragging = true;
                this.isDragging = isDragging;

                const x = event.pageX - slider.offsetLeft;
                const walk = (x - startX) * 3;
                const prevScrollLeft = slider.scrollLeft;
                theSlider.scrollLeft = scrollLeft - walk;
                velX = slider.scrollLeft - prevScrollLeft;
            });

            slider.addEventListener('wheel', () => {
                cancelMomentumTracking();
            });

            const items = [...slider.children];
            items.forEach((item) => {
                const links = item.querySelectorAll('a');
                links.forEach((link) => {
                    link.addEventListener('click', (event) => {
                        if (isDragging || this.isScrolling) event.preventDefault();
                    });
                });
            });
        },

        attachScroll(slider) {
            let rafID;
            let timeoutID;

            slider.addEventListener('scroll', (event) => {
                if (rafID) {
                    window.cancelAnimationFrame(rafID);
                    clearTimeout(timeoutID);
                }

                rafID = window.requestAnimationFrame(() => {
                    this.isScrolling = true;

                    this.scrollLeft = event.target.scrollLeft;

                    timeoutID = setTimeout(() => {
                        this.isScrolling = false;
                    }, 100);
                });
            });
        },

        prepareItems(slider) {
            const { dir } = slider.parentElement;
            const {
                offsetWidth: sliderWidth,
                scrollWidth: sliderScrollWidth,
            } = slider;
            const items = [...slider.children];
            const screens = this.getRanges(sliderWidth, sliderScrollWidth);
            const sliderGapPx = parseInt(getComputedStyle(slider).gap, 10);

            this.ranges = screens;
            let lastItemScreen = null;

            return items.map((item, index) => {
                const {
                    offsetLeft: itemStart,
                    offsetWidth: itemWidth,
                } = item;
                let itemDir = {
                    itemStart,
                    itemEnd: itemStart + itemWidth,
                };
                let scrollTo = itemDir.itemStart;

                if (dir === 'rtl') {
                    itemDir = {
                        itemStart: sliderWidth - (itemStart + itemWidth),
                        itemEnd: sliderWidth - itemStart,
                    };
                    scrollTo = -itemDir.itemStart;
                }

                const getAproxItemScreen = this.getAproxItemScreen({
                    itemIndex: index,
                    ...itemDir,
                    lastItemScreen,
                    screens,
                    sliderGapPx,
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
            itemIndex,
            itemStart, itemEnd,
            lastItemScreen,
            screens,
            sliderGapPx,
        }) {
            const gap = sliderGapPx * (itemIndex + 1);
            const itemScreen = screens
                .findIndex((screen) => {
                    const itemEndInScreen = itemEnd - gap <= screen.max;
                    const itemStartInScreen = screen.min <= itemStart - gap;
                    const itemStartInPrevScreen = itemStart - gap <= screen.min;
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

        snap({ slider, snap }) {
            const verb = snap ? 'add' : 'remove';

            slider.classList[verb]('slider-remove-snap');
        },
    },
};
</script>

<style lang="scss" scoped>
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

.slider {
    position: relative;
    background: #ced4da;
}

.slider-inner {
    display: flex;
    gap: 25px;
    padding-bottom: 25px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding: 25px;
    -webkit-overflow-scrolling: touch;
}

.slider-item {
    flex: 0 0 auto;
    height: 100%;
    scroll-snap-align: start;
    background: #adb5bd;

    a {
        display: block;
    }
}

.slider-remove-snap {
    scroll-snap-type: unset;
}

:dir(rtl) {
    .slider-control-next,
    .slider-control-prev {
        transform: rotate(180deg);
    }
}
.slider-range {
    display: flex;
    gap: 25px;
    scroll-padding: 25px;
    overflow-x: auto;
    text-align: center;
    background-color: #ced4da;
}
.slider-range-item {
    flex: 0 0 auto;
    border: 1px solid red;
}
</style>

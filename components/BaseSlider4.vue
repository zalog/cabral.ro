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
                <pre v-if="activeItem">{{
                    `items ${activeItem.index + 1}/${itemsLength}`
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
        activeItem() {
            return Object.values(this.internalItems)
                .find((item) => item.inView)
                || {};
        },
        activeScreenIndex() {
            return this.activeItem?.screen;
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
                itemPrev: !this.infinite && this.activeItem.index === 0,
                itemNext: !this.infinite && this.activeItem.index + 1 === this.itemsLength,
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

        goTo(index, entity = 'item', items = this.internalItems) {
            const slider = this.$refs['slider-inner'];
            const entityLength = (entity === 'item') ? this.itemsLength : this.screensLength;
            let wantedIndex = Number(index);

            if (wantedIndex + 1 > entityLength) wantedIndex = 0;
            else if (wantedIndex < 0) wantedIndex = entityLength - 1;

            const wantedItem = (entity === 'item')
                ? items[wantedIndex]
                : Object.values(items).find((item) => item.screen === wantedIndex);
            const { scrollTo } = wantedItem;

            slider.scrollTo({
                left: scrollTo,
                behavior: 'smooth',
            });
        },
        goToItemPrev() {
            this.goTo(this.activeItem.index - 1);
        },
        goToItemNext() {
            this.goTo(this.activeItem.index + 1);
        },
        goToScreenPrev() {
            this.goTo(this.activeScreenIndex - 1, 'screen');
        },
        goToScreenNext() {
            this.goTo(this.activeScreenIndex + 1, 'screen');
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
            this.ranges = screens;
            let lastItemScreen = null;

            return items.map((item, index) => {
                const {
                    offsetLeft: itemLeft,
                    offsetWidth: itemWidth,
                } = item;
                let itemDir = {
                    itemLeft,
                    itemRight: itemLeft + itemWidth,
                };
                let scrollTo = itemDir.itemLeft;

                if (dir === 'rtl') {
                    itemDir = {
                        itemRight: sliderWidth - (itemLeft + itemWidth),
                        itemLeft: sliderWidth - itemLeft,
                    };
                    scrollTo = -itemDir.itemRight;
                }

                const getAproxItemScreen = this.getAproxItemScreen({
                    itemIndex: index,
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
            itemIndex,
            itemLeft, itemRight,
            lastItemScreen,
            screens,
        }) {
            const gap = 25 * (itemIndex + 1);
            const itemScreen = screens
                .findIndex((screen) => {
                    const itemRightInScreen = itemRight - gap <= screen.max;
                    const itemLeftInScreen = screen.min <= itemLeft - gap;
                    const exactMatch = itemLeftInScreen && itemRightInScreen;
                    const aproxMatch = itemRightInScreen;
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
    .slider-item {
        scroll-snap-align: end;
    }
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

<template>
    <div
        ref="sliderInner"
        class="slider-inner"
        :class="innerClass"
    >
        <slot v-if="$slots.default" />
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
        dragging: {
            type: Boolean,
            default: false,
        },
        innerClass: {
            type: [Boolean, String],
            default: 'row',
        },
    },

    data: () => ({
        isDragging: false,
        isScrolling: false,
        internalItems: {},
    }),

    mounted() {
        const { sliderInner } = this.$refs;

        this.createStateItems(sliderInner);

        this.attachObserveItems(sliderInner);
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
</style>

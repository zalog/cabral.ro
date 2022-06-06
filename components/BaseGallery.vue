<template>
    <div />
</template>

<script>
import PhotoSwipe from 'photoswipe/dist/photoswipe.esm';

const setNaturalSizes = (imgEl, pswpContent) => {
    const { naturalWidth, naturalHeight } = imgEl;

    Object.assign(pswpContent.instance.options.dataSource[pswpContent.index], {
        width: `${naturalWidth}`,
        height: `${naturalHeight}`,
    });

    if (pswpContent.hasSlide) {
        Object.assign(pswpContent.slide, {
            width: naturalWidth,
            height: naturalHeight,
        });
    } else if (!pswpContent.slide) {
        Object.assign(pswpContent, {
            width: naturalWidth,
            height: naturalHeight,
        });
    }
};

export default {
    model: {
        prop: 'index',
        event: 'update:index',
    },

    props: {
        items: {
            type: Array,
            required: true,
        },
        index: {
            type: Number,
            default: 0,
        },
        hash: {
            type: [Boolean, String],
            default: 'image',
        },
    },

    async mounted() {
        this.pswp = new PhotoSwipe({
            dataSource: this.items,
            index: this.index,
        });
        this.photoSwipeInit(this.pswp);
    },

    methods: {
        async photoSwipeInit(pswp) {
            pswp.addFilter('useContentPlaceholder', (_, { width, height }) => {
                if (width || height) return true;

                return false;
            });

            pswp.on('initialLayout', () => {
                if (this.hash) {
                    this.$router.push({
                        hash: this.hash,
                        query: this.$route.query,
                    });
                }
            });

            pswp.on('contentLoadImage', (eventPswp) => {
                const { content } = eventPswp;
                const { width, height } = content.instance.options.dataSource[content.index];

                if (width || height) return;

                eventPswp.preventDefault();

                content.element = document.createElement('img');
                content.element.style.opacity = '0';
                content.element.src = content.data.src;
                content.element.className = 'pswp__img';

                content.state = 'loading';

                if (content.element.complete) {
                    setNaturalSizes(content.element, content);

                    content.onLoaded();
                } else {
                    content.element.onload = function onload({ target: imgLoaded }) {
                        setNaturalSizes(imgLoaded, content);

                        content.onLoaded();
                    };

                    content.element.onerror = () => {
                        content.onError();
                    };
                }
            });

            pswp.on('contentAppendImage', (eventPswp) => {
                const { content } = eventPswp;
                const { width, height } = content;

                if (width || height) {
                    content.element.style.opacity = '1';
                    return;
                }

                content.element.decode().then(() => {
                    if (
                        width !== content.element.naturalWidth
                        || height !== content.element.naturalHeight
                    ) {
                        content.width = content.element.naturalWidth;
                        content.height = content.element.naturalHeight;

                        content.instance.updateSize(true);
                        content.element.style.opacity = '1';
                    }
                });
            });

            pswp.on('contentActivate', ({ content }) => {
                this.$emit('update:index', content.index);
            });

            pswp.on('destroy', () => {
                if (this.$route.hash.indexOf(this.hash) !== -1) {
                    this.$router.replace({
                        query: this.$route.query,
                    });
                }

                this.$emit('hidden');
            });

            pswp.init();
        },
    },
};
</script>

<style lang="css">
@import "photoswipe/dist/photoswipe.css";
</style>

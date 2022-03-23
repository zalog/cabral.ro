<template>
    <div ref="pswp" class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="pswp__bg" />
        <div class="pswp__scroll-wrap">
            <div class="pswp__container">
                <div class="pswp__item" />
                <div class="pswp__item" />
                <div class="pswp__item" />
            </div>

            <div class="pswp__ui pswp__ui--hidden">
                <div class="pswp__top-bar">
                    <div class="pswp__counter" />
                    <button class="pswp__button pswp__button--close" title="Close (Esc)" />
                    <button class="pswp__button pswp__button--share" title="Share" />
                    <button class="pswp__button pswp__button--fs" title="Toggle fullscreen" />
                    <button class="pswp__button pswp__button--zoom" title="Zoom in/out" />
                    <div class="pswp__preloader">
                        <div class="pswp__preloader__icn">
                            <div class="pswp__preloader__cut">
                                <div class="pswp__preloader__donut" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                    <div class="pswp__share-tooltip" />
                </div>

                <button
                    class="pswp__button pswp__button--arrow--left"
                    title="Previous (arrow left)"
                />
                <button
                    class="pswp__button pswp__button--arrow--right"
                    title="Next (arrow right)"
                />

                <div class="pswp__caption">
                    <div class="pswp__caption__center" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUIDefault from 'photoswipe/dist/photoswipe-ui-default';

export default {
    name: 'Photoswipe',

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
    },

    mounted() {
        this.initPhotoSwipe();
    },

    methods: {
        initPhotoSwipe() {
            const gallery = new PhotoSwipe(
                this.$refs.pswp,
                PhotoSwipeUIDefault,
                this.items,
                {
                    index: this.index,
                    history: false,
                },
            );

            gallery.listen('destroy', () => {
                this.$router.push({ hash: false });
                this.$emit('closed');
            });
            gallery.listen('gettingData', (_index, getItem) => {
                const item = getItem;

                if (item.w < 1 || item.h < 1) {
                    const img = new Image();

                    img.onload = function onload() {
                        item.w = this.width;
                        item.h = this.height;
                        gallery.updateSize(true);
                    };

                    img.src = item.src;
                }
            });
            gallery.listen('afterChange', async () => {
                const index = gallery.getCurrentIndex();
                const hash = `pid=${index + 1}`;

                this.$emit('update:index', index);
                if (!this.$route.hash.includes(`${hash}`)) {
                    await this.$router.push({ hash });
                }
            });

            gallery.init();
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/photoswipe";
</style>

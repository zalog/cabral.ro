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
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

export default {
    name: 'Photoswipe',

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
        const that = this;
        const gallery = new PhotoSwipe(
            this.$refs['pswp'],
            PhotoSwipeUI_Default,
            this.items,
            {
                index: this.index,
                history: false,
            },
        );

        gallery.listen('destroy', () => {
            this.$router.push({ hash: false });
            that.$emit('closed');
        });
        gallery.listen('gettingData', (index, item) => {
            if (item.w < 1 || item.h < 1) {
                const img = new Image();

                img.onload = function() {
                    item.w = this.width;
                    item.h = this.height;
                    gallery.updateSize(true);
                };

                img.src = item.src;
            }
        });
        gallery.listen('afterChange', async () => {
            const index = gallery.getCurrentIndex();

            await this.$router.push({ hash: `pid=${index}` });
            this.$emit('changed-item', index);
        });

        gallery.init();
    },
};
</script>

<style lang="scss" scoped>
/deep/ {
    @import "node_modules/photoswipe/dist/photoswipe.css";
    $pswp__assets-path: "~photoswipe/src/css/default-skin/";
    @import "~photoswipe/src/css/default-skin/default-skin.scss";
}
</style>

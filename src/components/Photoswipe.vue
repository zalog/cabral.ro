<template>
  <div ref="pswp" class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="pswp__bg"></div>
    <div class="pswp__scroll-wrap">
      <div class="pswp__container">
        <div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div>
      </div>

      <div class="pswp__ui pswp__ui--hidden">

        <div class="pswp__top-bar">
          <div class="pswp__counter"></div>
          <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
          <button class="pswp__button pswp__button--share" title="Share"></button>
          <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
          <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
          <div class="pswp__preloader">
            <div class="pswp__preloader__icn">
              <div class="pswp__preloader__cut">
                <div class="pswp__preloader__donut"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
          <div class="pswp__share-tooltip"></div>
        </div>

        <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
        <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>

        <div class="pswp__caption">
          <div class="pswp__caption__center"></div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { SITE } from "./../utils/constants";
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

export default {
  name: 'Photoswipe',

  props: {
    items: {
      type: Array,
      required: true
    },
    index: {
      type: Number,
      default: 0
    },
    title: {
      type: String
    }
  },

  metaInfo() {
    return {
      title: this.pageTitle
    };
  },

  data: () => ({
    currentImage: null
  }),

  computed: {
    pageTitle() {
      return `${this.title} - Image ${this.currentImage}`;
    }
  },

  watch: {
    'currentImage': function(image) {
      this.sendImageView(image);
    }
  },

  mounted() {
    const that = this;
    const gallery = new PhotoSwipe(
      this.$refs['pswp'],
      PhotoSwipeUI_Default,
      this.items,
      {
        index: this.index
      }
    );

    gallery.listen('destroy', () => {
      that.$emit('closed');
    });
    gallery.listen('gettingData', function(index, item) {
      if (item.w < 1 || item.h < 1) {
        var img = new Image();
        img.onload = function() {
          item.w = this.width;
          item.h = this.height;
          gallery.updateSize(true);
        };
        img.src = item.src;
      }
    });
    gallery.listen('afterChange', () => {
      this.currentImage = gallery.getCurrentIndex() + 1;
    });

    gallery.init();
  },

  methods: {
    sendImageView(image) {
      let title = SITE.TITLE_TEMPLATE(this.pageTitle);
      let url = document.location.href.replace(/&pid=\d+/, `&pid=${image}`);

      window.dataLayer.push({ event: 'imageview', title, url });
    }
  }
};
</script>

<style lang="css" scoped>
  @import "~photoswipe/dist/photoswipe.css";
  @import "~photoswipe/dist/default-skin/default-skin.css";
</style>
<template>
  <div
    v-if="data.single"
    class="page-single"
  >
    <div
      class="container-fluid py-5"
    >
      <h1
        v-html="data.single.title.rendered"
        class="entry-title"
      />
      <div
        ref="content"
        v-html="data.single.content"
        class="entry-content"
      />
    </div>

    <div class="bg-light">
      <div class="container-fluid py-5">
        <CommentsList
          ref="comments"
          :currentPath="currentPath"
        />
      </div>
    </div>

    <Photoswipe
      v-if="photoswipe.show"
      :items="photoswipe.items"
      :index="photoswipe.index"
      @closed="photoswipe.show = false"
    />
  </div>
</template>

<script>
import { SITE } from "./../utils/constants";
import decodeHtml from "./../utils/decodeHtml";
import CommentsList from "./../components/CommentsList.vue";
import { postFormWpcf7 } from "./../services/forms";

const Photoswipe = () => import(/* webpackChunkName: "photoswipe" */ "./../components/Photoswipe.vue");

export default {
  name: 'PageSingle',

  components: {
    CommentsList,
    Photoswipe
  },

  data: () => ({
    currentPath: null,
    photoswipe: {
      show: false,
      items: [],
      index: 0
    }
  }),

  computed: {
    data() {
      let page = this.$store.state.data.find(obj => obj[this.currentPath]);
      return (typeof page !== 'undefined') ? page[this.currentPath] : false;
    },
    pageTitle() {
      return this.data.single && decodeHtml(this.data.single.title.rendered);
    }
  },

  watch: {
    '$route': 'fetchSingle'
  },

  serverPrefetch() {
    return this.fetchSingle();
  },

  beforeMount() {
    this.currentPath = this.$route.path;
    this.fetchSingle();
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll);

    this.photoswipeInit();
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },

  metaInfo() {
    return {
      title: this.pageTitle
    };
  },

  methods: {
    fetchSingle() {
      let actionName = 'data/fetchSingle';
      if (this.$route.params.singleType === 'post') actionName = 'data/fetchPost';
      else if (this.$route.params.singleType === 'page') actionName = 'data/fetchPage';

      return this.$store.dispatch(actionName, {
        slug: this.$route.path,
        pageLoading: true
      }).then(() => {
        this.currentPath = this.$route.path;
        this.afterDataLoaded();
      });
    },
    afterDataLoaded() {
      if (typeof window === 'undefined') return;

      this.sendPageView();
      this.fetchComments();
      this.handleFormWpcf7();
    },
    sendPageView() {
      window.dataLayer.push({ event: 'pageview', title: SITE.TITLE_TEMPLATE(this.pageTitle) });
    },
    photoswipeInit() {
      this.$refs['content'].querySelectorAll('img').forEach((img, index) => {
        let src = img.getAttribute('data-src') || img.getAttribute('data-orig-file');
        src = src.split('?')[0];
        let size = img.getAttribute('data-orig-size') || '0,0';
        size = size.split(',');

        this.photoswipe.items.push({ src, w: size[0], h: size[1] });

        img.addEventListener('click', (event) => {
          event.preventDefault();
          this.photoswipe.show = true;
          this.photoswipe.index = index;
        });
      });
    },
    fetchComments() {
      if (this.data.comments && this.data.comments.loading || !this.isVisibleLastComment()) return;

      this.$store.dispatch('data/fetchComments', {
        slug: this.$route.path
      });
    },
    handleScroll() {
      this.fetchComments();
    },
    isVisibleLastComment() {
      if (!this.$refs['comments']) return;

      let comments = this.$refs['comments'].$el.getBoundingClientRect();
      const visible = document.documentElement.clientHeight;
      const commentsTop = comments.top + comments.height;

      return (visible >= commentsTop);
    },
    handleFormWpcf7() {
      const elSpinner = document.createElement('div');
      elSpinner.classList.add('spinner-border', 'spinner-border-sm', 'mr-1');

      this.$refs['content'].querySelectorAll('.wpcf7').forEach((formWrap) => {
        const elFormMessage = formWrap.querySelector('.screen-reader-response');
        const elForm = formWrap.querySelector('.wpcf7-form');
        const elBtnSubmit = formWrap.querySelector('.wpcf7-submit');
        const formId = elForm.querySelector('input[name="_wpcf7"]').value;

        elForm.addEventListener('submit', (event) => {
          event.preventDefault();

          elBtnSubmit.insertBefore(elSpinner, elBtnSubmit.querySelector('span'));
          elFormMessage.classList = '';

          const formData = new FormData(event.target);

          postFormWpcf7(formId, formData).then((response) => {
            let alertClass = 'danger';

            if (response.status === 'mail_sent') {
              alertClass = 'success';
              elForm.querySelectorAll('input, textarea').forEach((el) => {
                el.value = '';
                el.classList.remove('is-invalid');
              });
            } else {
              // console.log(response.invalidFields);
              response.invalidFields.forEach((field) => {
                elForm.querySelectorAll(field.into).forEach(el => {
                  el.querySelector('.wpcf7-form-control').classList.add('is-invalid');
                });
              });
            }

            elFormMessage.textContent = response.message;
            elFormMessage.classList.add('alert', `alert-${alertClass}`);
          }).catch((error) => {
            elFormMessage.textContent = error.message;
            elFormMessage.classList.add('alert', 'alert-danger');
          }).finally(() => {
            elBtnSubmit.removeChild(elSpinner);
          });
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./../scss/app-component.scss";

.container-fluid {
  max-width: 700px;
}

/deep/ {
  @import "~bootstrap/scss/forms";
  @import "~bootstrap/scss/buttons";
  @import "~bootstrap/scss/alert";
  @import "./../scss/pages/single";
}
</style>
<template>
  <div
    v-if="data"
    class="page-single"
  >
    <div
      class="container-fluid py-5"
    >
      <h1 class="entry-title">{{ data.single.title.rendered }}</h1>
      <div
        v-html="data.single.content.rendered"
        class="entry-content"
      />
    </div>

    <div class="bg-light">
      <div class="container-fluid py-5">
        <CommentsList
          ref="comments"
          :comments="data.comments"
          :loading="loadComments"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CommentsList from "./../components/CommentsList.vue";

export default {
  name: 'Single',

  components: {
    CommentsList
  },

  data: () => ({
    currentPath: null,
    loadComments: false
  }),

  serverPrefetch() {
    return this.fetchSingle();
  },

  beforeMount() {
    this.currentPath = this.$route.fullPath;
    this.fetchSingle();
  },

  mounted() {
    this.loadComments = this.isVisibleLastComment();
    window.addEventListener('scroll', this.handleScroll);
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },

  watch: {
    $route() {
      this.fetchSingle();
    },
    loadComments(load) {
      load && this.fetchComments();
    }
  },

  computed: {
    data() {
      let page = this.$store.state.data.find(obj => obj[this.currentPath]);
      return (typeof page !== 'undefined') ? page[this.currentPath] : false;
    }
  },

  methods: {
    fetchSingle() {
      let actionName = 'data/fetchSingle';
      if (this.$route.params.singleType === 'post') actionName = 'data/fetchPost';
      else if (this.$route.params.singleType === 'page') actionName = 'data/fetchPage';

      return this.$store.dispatch(actionName, {
        slug: this.$route.fullPath,
        pageLoading: true
      }).then(() => {
        this.currentPath = this.$route.fullPath;
      });
    },
    fetchComments() {
      this.$store.dispatch('data/fetchComments', {
        slug: this.$route.fullPath
      }).then(() => {
        this.loadComments = false;
      });
    },
    handleScroll() {
      if (this.loadComments) return;

      this.loadComments = this.isVisibleLastComment();
    },
    isVisibleLastComment() {
      if (!this.$refs['comments']) return;

      let comments = this.$refs['comments'].$el.getBoundingClientRect();
      const visible = document.documentElement.clientHeight;
      const commentsTop = comments.top + comments.height;

      return (visible >= commentsTop);
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
  @import "./../scss/pages/single";
}
</style>
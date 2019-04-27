<template>
  <div class="page-single">
    <div
      v-if="data.data"
      class="container-fluid py-5"
    >
      <h1 class="entry-title">{{ data.data.title.rendered }}</h1>
      <div
        v-html="data.data.content.rendered"
        class="entry-content"
      />
    </div>

    <div class="bg-light">
      <div class="container-fluid py-5">
        <CommentsList
          :data="data.comments"
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
    forceDataRecompute: 1,
    currentPath: null
  }),

  serverPrefetch() {
    return this.fetchSingle();
  },

  beforeMount() {
    this.currentPath = this.$route.fullPath;
    this.fetchSingle().then(() => {
      this.fetchComments();
    });
  },

  watch: {
    $route() {
      this.fetchSingle().then(() => {
        this.fetchComments();
      });
    }
  },

  computed: {
    data() {
      this.forceDataRecompute;
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
        this.forceDataRecompute++;
      });
    },
    fetchComments() {
      this.$store.dispatch('data/fetchComments', {
        slug: this.$route.fullPath
      }).then(() => {
        this.forceDataRecompute++;
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
  @import "./../scss/pages/single";
}
</style>
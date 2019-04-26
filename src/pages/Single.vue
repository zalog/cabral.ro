<template>
  <div>
    <div
      v-if="data.data"
      class="container-fluid py-5 entry"
    >
      <h1 class="entry-title">{{ data.data.title.rendered }}</h1>
      <div
        v-html="data.data.content.rendered"
        class="entry-content"
      />
    </div>

    <div class="bg-light">
      <div class="container-fluid py-5">
        <ul v-if="data.comments">
          <li
            v-for="comment in data.comments" :key="'comments-comment-' + comment.id"
          >
            <h3>{{ comment.author_name }}</h3>
            <div v-html="comment.content.rendered" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Single',

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
        slug: this.$route.fullPath
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

.entry {
  max-width: 700px;
  margin-right: auto;
  margin-left: auto;
}

/deep/ {
  @import "./../scss/pages/single";
}
</style>
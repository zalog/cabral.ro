<template>
  <div
    v-if="data"
    class="page-category container-fluid py-5"
  >
    <h1 class="mb-4">{{ this.currentPath }}</h1>
    <PostsList
      :posts="data.posts"
    />
  </div>
</template>

<script>
import PostsList from "./../components/PostsList.vue";

export default {
  name: 'PageCategory',

  components: {
    PostsList
  },

  data: () => ({
    forceDataRecompute: 1,
    currentPath: null
  }),

  serverPrefetch() {
    return this.fetchPosts();
  },

  beforeMount() {
    this.currentPath = this.$route.fullPath;
    this.fetchPosts();
  },

  metaInfo() {
    return {
      title: this.currentPath
    };
  },

  watch: {
    $route() {
      this.fetchPosts();
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
    fetchPosts() {
      return this.$store.dispatch('data/fetchPosts', {
        currentPage: this.$route.params.id || 1,
        path: this.$route.fullPath,
        pageLoading: true,
        categories: [this.$route.params.categorySlug]
      }).then(() => {
        this.currentPath = this.$route.fullPath;
        this.forceDataRecompute++;
      });
    }
  }
};
</script>
<template>
  <div class="container-fluid py-5">
    <h1 class="mb-4">Category</h1>
    <PostsList
      v-if="data"
      :posts="data.posts"
    />
  </div>
</template>

<script>
import PostsList from "./../components/PostsList.vue";

export default {
  name: 'Category',

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
        categories: [this.$route.params.categorySlug]
      }).then(() => {
        this.currentPath = this.$route.fullPath;
        this.forceDataRecompute++;
      });
    }
  }
};
</script>
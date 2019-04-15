<template>
  <div>
    <h1>Category</h1>
    <PostsList
      v-if="data"
      :posts="data.posts"
      :pagination="data.postsPagination"
    />
  </div>
</template>

<script>
import PostsList from "./PostsList.vue";

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

  watch: {
    $route() {
      this.fetchPosts();
    }
  },

  computed: {
    data() {
      this.forceDataRecompute;
      return this.$store.state.data[this.currentPath];
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
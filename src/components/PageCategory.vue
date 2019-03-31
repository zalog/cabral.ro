<template>
  <div>
    <h1>Category</h1>
    <PostsList
      :posts="posts"
      :pagination="pagination"
    />
  </div>
</template>

<script>
import PostsList from "./PostsList.vue";
import postsModule from './../store/modules/posts';

export default {
  name: 'PageCategory',

  components: {
    PostsList
  },

  serverPrefetch() {
    this.registerModule();
    return this.fetchPosts(this.$route.params.id);
  },

  beforeMount() {
    this.registerModule();
    if (!this.$store.state.categories.posts.length) this.fetchPosts(this.$route.params.id);
  },

  destroyed() {
    this.$store.unregisterModule('categories');
  },

  watch: {
    $route(to) {
      if (typeof to.params.id === 'undefined') this.fetchPosts(1);
      else this.fetchPosts(to.params.id);
    }
  },

  computed: {
    posts() {
      return this.$store.state.categories.posts;
    },
    pagination() {
      return this.$store.state.categories.pagination;
    }
  },

  methods: {
    registerModule() {
      this.$store.registerModule('categories', postsModule, { preserveState: !!this.$store.state.categories });
    },
    fetchPosts(currentPage) {
      return this.$store.dispatch('categories/fetch', {currentPage, categories: [this.$route.params.categorySlug]});
    }
  }
};
</script>
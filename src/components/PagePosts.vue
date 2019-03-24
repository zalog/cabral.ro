<template>
  <div>
    <div>Posts</div>
    <ul>
      <li v-for="(post, index) in posts" :key="index">
        <a v-html="post.title.rendered" />
      </li>
    </ul>

    <span v-for="(page, index) in pagination" :key="index">
      <router-link
        :to="'/posts/page/' + page"
        @click.native="fetchPosts(page)"
      >{{ page }}</router-link>
      /
    </span>
  </div>
</template>

<script>
import postsModule from '../store/modules/posts';

export default {
  computed: {
    posts() {
      return this.$store.state.posts.posts;
    },
    pagination() {
      return this.$store.state.posts.pagination;
    }
  },

  serverPrefetch() {
    this.registerModule();
    return this.fetchPosts(this.$route.params.id);
  },

  beforeMount() {
    this.registerModule();
    if (!this.$store.state.posts.posts.length) this.fetchPosts(this.$route.params.id);
  },

  destroyed() {
    this.$store.unregisterModule('posts');
  },

  watch: {
    $route(to) {
      if (typeof to.params.id === 'undefined') this.fetchPosts(1);
    }
  },

  methods: {
    registerModule() {
      this.$store.registerModule('posts', postsModule, { preserveState: !!this.$store.state.posts });
    },
    fetchPosts(pageNr) {
      this.$store.dispatch('posts/fetch', pageNr);
    }
  }
};
</script>
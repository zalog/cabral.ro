<template>
  <div>Posts {{ postsCount }}</div>
</template>

<script>
import postsModule from '../store/modules/posts'

export default {
  computed: {
    postsCount() {
      return this.$store.state.posts.count
    }
  },

  serverPrefetch() {
    this.registerModule();
    return this.$store.dispatch('posts/inc');
  },

  beforeMount() {
    this.registerModule();
    if (this.$store.state.posts.count === 0) {
      this.$store.dispatch('posts/inc');
    }
  },

  destroyed() {
    this.$store.unregisterModule('posts')
  },

  methods: {
    registerModule() {
      this.$store.registerModule('posts', postsModule, { preserveState: !!this.$store.state.posts })
    }
  }
}
</script>
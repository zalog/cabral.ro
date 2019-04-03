<template>
  <div v-if="single">
    <h1>{{ single.title.rendered }}</h1>
    <div v-html="single.content.rendered" />
  </div>
</template>

<script>
import singleModule from "../store/modules/single";

export default {
  name: 'PageSingle',

  serverPrefetch() {
    this.registerModule();
    return this.fetchSingle(this.$route.params.singleSlug);
  },

  beforeMount() {
    this.registerModule();
    this.fetchSingle(this.$route.params.singleSlug);
  },

  destroyed() {
    this.$store.unregisterModule('single');
  },

  watch: {
    $route(to) {
      this.fetchSingle(to.params.singleSlug);
    }
  },

  computed: {
    single() {
      if (this.$route.params.singleType === 'post')
        return this.$store.state.single.post;
      else if (this.$route.params.singleType === 'page')
        return this.$store.state.single.page;
      else
        return this.$store.state.single.post || this.$store.state.single.page;
    }
  },

  methods: {
    registerModule() {
      this.$store.registerModule('single', singleModule, { preserveState: !!this.$store.state.single });
    },
    fetchSingle(singleSlug) {
      if (this.$route.params.singleType === 'post')
        return this.$store.dispatch('single/fetchPost', singleSlug);
      else if (this.$route.params.singleType === 'page')
        return this.$store.dispatch('single/fetchPage', singleSlug);
      else
        return this.$store.dispatch('single/fetch', singleSlug);
    }
  }
};
</script>
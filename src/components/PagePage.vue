<template>
  <div v-if="page">
    <h1>{{ page.title.rendered }}</h1>
    <div v-html="page.content.rendered" />
  </div>
</template>

<script>
import pageModule from "../store/modules/page";

export default {
  name: 'PagePage',

  serverPrefetch() {
    this.registerModule();
    if (!this.$store.state.page.page.length) return this.fetchPage(this.$route.params.pageSlug);
  },

  beforeMount() {
    this.registerModule();
    this.fetchPage(this.$route.params.pageSlug);
  },

  destroyed() {
    this.$store.unregisterModule('page');
  },

  watch: {
    $route(to) {
      this.fetchPage(to.params.pageSlug);
    }
  },

  computed: {
    page() {
      return this.$store.state.page.page;
    }
  },

  methods: {
    registerModule() {
      this.$store.registerModule('page', pageModule, { preserveState: !!this.$store.state.page });
    },
    fetchPage(pageSlug) {
      return this.$store.dispatch('page/fetch', pageSlug);
    }
  }
};
</script>
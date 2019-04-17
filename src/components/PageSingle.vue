<template>
  <div v-if="data.data">
    <h1>{{ data.data.title.rendered }}</h1>
    <div v-html="data.data.content.rendered" />
  </div>
</template>

<script>
export default {
  name: 'PageSingle',

  data: () => ({
    forceDataRecompute: 1,
    currentPath: null
  }),

  serverPrefetch() {
    return this.fetchSingle();
  },

  beforeMount() {
    this.currentPath = this.$route.fullPath;
    this.fetchSingle();
  },

  watch: {
    $route() {
      this.fetchSingle();
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
      return this.$store.dispatch('data/fetchSingle', {
        slug: this.$route.fullPath
      }).then(() => {
        this.currentPath = this.$route.fullPath;
        this.forceDataRecompute++;
      });
    }
  }
};
</script>
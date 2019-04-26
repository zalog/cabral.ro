<template>
  <div
    v-if="data.data"
    class="entry"
  >
    <h1 class="entry-title">{{ data.data.title.rendered }}</h1>
    <div
      v-html="data.data.content.rendered"
      class="entry-content"
    />
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
      let actionName = 'data/fetchSingle';
      if (this.$route.params.singleType === 'post') actionName = 'data/fetchPost';
      else if (this.$route.params.singleType === 'page') actionName = 'data/fetchPage';

      return this.$store.dispatch(actionName, {
        slug: this.$route.fullPath
      }).then(() => {
        this.currentPath = this.$route.fullPath;
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
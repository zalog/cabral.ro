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
import { SITE } from "./../utils/constants";
import decodeHtml from "./../utils/decodeHtml";
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

  computed: {
    data() {
      this.forceDataRecompute;
      let page = this.$store.state.data.find(obj => obj[this.currentPath]);
      return (typeof page !== 'undefined') ? page[this.currentPath] : false;
    },
    pageTitle() {
      let page = (this.$route.params.id) ? ` - pagina ${this.$route.params.id}` : '';
      return decodeHtml(this.currentPath + page);
    }
  },

  watch: {
    '$route': 'fetchPosts'
  },

  serverPrefetch() {
    return this.fetchPosts();
  },

  beforeMount() {
    this.currentPath = this.$route.path;
    this.fetchPosts();
  },

  metaInfo() {
    return {
      title: this.pageTitle
    };
  },

  methods: {
    fetchPosts() {
      return this.$store.dispatch('data/fetchPosts', {
        currentPage: this.$route.params.id || 1,
        path: this.$route.path,
        pageLoading: true,
        categories: [this.$route.params.categorySlug]
      }).then(() => {
        this.currentPath = this.$route.path;
        this.forceDataRecompute++;
        this.afterDataLoaded();
      });
    },
    afterDataLoaded() {
      if (typeof window === 'undefined') return;

      this.sendPageView();
    },
    sendPageView() {
      window.dataLayer.push({ event: 'pageview', title: SITE.TITLE_TEMPLATE(this.pageTitle) });
    }
  }
};
</script>
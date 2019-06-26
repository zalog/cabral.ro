<template>
  <div
    v-if="data"
    class="page-category container-fluid py-5"
  >
    <h1 class="mb-4">{{ this.pageTitle }}</h1>
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
    forceDataRecompute: 1
  }),

  computed: {
    data() {
      this.forceDataRecompute;
      return this.$store.getters['data/currentPage'];
    },
    pageTitle() {
      let page = (this.$route.params.id) ? ` - pagina ${this.$route.params.id}` : '';
      return decodeHtml(this.$route.path + page);
    }
  },

  watch: {
    '$route': 'fetchPosts'
  },

  serverPrefetch() {
    return this.fetchPosts();
  },

  beforeMount() {
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
        categories: [this.$route.params.categorySlug]
      }).then(() => {
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
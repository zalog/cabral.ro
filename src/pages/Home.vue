<template>
  <div
    v-if="data"
    class="page-home container-fluid py-5"
  >
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
  name: 'PageHome',

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
      return this.$store.getters['data/currentPage'];
    },
    pageTitle() {
      let page = (this.$route.params.id) ? ` - pagina ${this.$route.params.id}` : '';
      return decodeHtml(SITE.TITLE + page);
    }
  },

  watch: {
    '$route'() {
      this.fetchPosts();
      this.sendPageView();
    }
  },

  serverPrefetch() {
    return this.fetchPosts();
  },

  beforeMount() {
    this.currentPath = this.$route.path;
    this.fetchPosts();
    this.sendPageView();
  },

  metaInfo() {
    return {
      title: this.pageTitle,
      titleTemplate: false
    };
  },

  methods: {
    fetchPosts() {
      return this.$store.dispatch('data/fetchPosts', {
        currentPage: this.$route.params.id || 1,
        path: this.$route.path,
        pageLoading: true
      }).then(() => {
        this.currentPath = this.$route.path;
        this.forceDataRecompute++;
      });
    },
    sendPageView() {
      window.dataLayer.push({ event: 'pageview', title: this.pageTitle });
    }
  }
};
</script>
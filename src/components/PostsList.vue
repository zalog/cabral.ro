<template>
  <div>
    <router-link
      tag="div"
      class="card mb-5"
      v-for="(post, index) in posts.data" :key="index"
      :to="postTo(post.slug)"
    >
      <img :src="post.featured_media_src" class="card-img-top">
      <div class="card-body" :to="postTo(post.slug)">
        <h2 class="card-title">
          <router-link v-html="post.title.rendered" :to="postTo(post.slug)" />
        </h2>
        <div class="card-text" v-html="post.excerpt.rendered" />
      </div>
    </router-link>

    <span v-for="(page, index) in posts.pagination.data" :key="index">
      <router-link
        :to="paginationTo(page)"
        :class="{ 'active': [posts.pagination.currentPage] == page }"
      >{{ page }}</router-link>
      /
    </span>
  </div>
</template>

<script>
export default {
  name: 'PostsList',

  props: {
    posts: {
      type: Object,
      required: true
    }
  },

  methods: {
    paginationTo(page) {
      const categorySlug = this.$route.params.categorySlug;
      let url = `/page/${page}`;

      if (categorySlug) url = `/category/${categorySlug}${url}`;

      return url;
    },
    postTo(slug) {
      return {
        name: 'single',
        params: {
          singleSlug: slug,
          singleType: 'post'
        }
      };
    }
  }
};
</script>
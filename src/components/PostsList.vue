<template>
  <div>
    <ul>
      <router-link
        tag="li"
        v-for="(post, index) in posts.data" :key="index"
        :to="postTo(post.slug)"
      >
        <a v-html="post.title.rendered" />
      </router-link>
    </ul>

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
<template>
  <div>
    <ul>
      <li v-for="(post, index) in posts" :key="index">
        <a v-html="post.title.rendered" />
      </li>
    </ul>

    <span v-for="(page, index) in pagination" :key="index">
      <router-link
        :to="paginationTo(page)"
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
      type: Array,
      required: true
    },
    pagination: {
      type: Array,
      required: true
    }
  },

  methods: {
    paginationTo(page) {
      const categorySlug = this.$route.params.categorySlug;
      let url = `/page/${page}`;

      if (categorySlug) url = `/category/${categorySlug}${url}`;

      return url;
    }
  }
};
</script>
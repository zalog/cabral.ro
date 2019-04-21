<template>
  <div class="cards-posts">
    <router-link
      tag="div"
      class="card mb-5"
      v-ripple
      v-for="(post, index) in posts.data" :key="index"
      :to="postTo(post.slug)"
    >
      <div v-if="post.featured_media_src" class="card-img-top">
        <img :src="post.featured_media_src">
      </div>
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

<style lang="scss" scoped>
@import "./../scss/app-component.scss";

$card-border-radius:          $border-radius-lg;
$card-border-color:           transparent;

@import "~bootstrap/scss/card";

.cards-posts /deep/ {
  .card {
    cursor: pointer;
    box-shadow: $box-shadow-lg;
    border: 0;
  }
  .card-img-top {
    position: relative;
    padding-top: percentage(9/16);
    overflow: hidden;

    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: auto;
    }
  }
  .card-title > a {
    color: $body-color;
  }
  .card-text > *:last-child {
    margin-bottom: 0;
  }
}
</style>

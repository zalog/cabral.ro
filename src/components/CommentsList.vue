<template>
  <ul class="list-comments">
    <li v-if="!data">loading...</li>
    <li
      v-for="comment in data" :key="'comments-comment-' + comment.id"
    >
      <h3>{{ comment.author_name }}</h3>
      <div v-html="comment.content.rendered" />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'CommentsList',

  props: {
    data: {
      type: [Array, Boolean],
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./../scss/app-component.scss";

.list-comments {
  @include list-unstyled;
  li {
    padding: $spacer;
    margin-bottom: map-get($spacers, 4);
    background-color: $white;
    box-shadow: $box-shadow-sm;
  }
}
</style>
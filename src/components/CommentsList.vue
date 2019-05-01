<template>
  <ul class="list-comments">
    <li
      v-for="comment in comments.data" :key="'comments-comment-' + comment.id"
    >
      <div class="comment-header">
        <div v-html="printAuthor(comment)" />
        <div>{{ printDate(comment) }}</div>
      </div>
      <div
        class="comment-content"
        v-html="comment.content.rendered"
      />
    </li>
    <li
      v-if="loading === true"
      class="text-center"
    >
      <b-spinner variant="warning" label="Loading..."></b-spinner>
    </li>
  </ul>
</template>

<script>
import BSpinner from 'bootstrap-vue/es/components/spinner/spinner';

export default {
  name: 'CommentsList',

  components: {
    'b-spinner': BSpinner
  },

  props: {
    comments: {
      type: Object
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    printAuthor(comment) {
      let output = comment.author_name;
      if (comment.author_url) output = `<a href="${comment.author_url}" target="_blank">${output}</a>`;

      return output;
    },
    printDate(comment) {
      let format = { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit' };

      return new Date(comment.date).toLocaleString("ro-RO", format);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./../scss/app-component.scss";
@import "~bootstrap/scss/spinners";

.list-comments /deep/ {
  @include list-unstyled;
  li {
    padding: map-get($spacers, 4);
    margin-bottom: map-get($spacers, 4);
    background-color: $white;
    box-shadow: $box-shadow-sm;

    > * + * {
      margin-top: $spacer;
    }
  }

  .comment-header {
    div:first-child {
      font-weight: bold;
      color: $gray-700;

      a {
        color: $gray-700;
      }
    }
    div:last-child {
      font-size: $font-size-sm;
      color: $gray-600;
    }
  }

  .comment-content {
    > p:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
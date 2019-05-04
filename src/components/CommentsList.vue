<template>
  <div>
    <form class="form-reply">
      <div class="text-muted">Lasă un comentariu...</div>
    </form>

    <ul class="list-comments">
      <li
        v-for="(comment, index) in comments.data" :key="'comments-comment-' + index"
      >
        <CommentsListComment :comment="comment" />

        <ul v-if="comment.replies.nodes.length">
          <li
            v-for="(comment, index) in comment.replies.nodes" :key="'comments-comment-l1-' + index"
          >
            <CommentsListComment :comment="comment" />
          </li>
        </ul>

        <form class="form-reply">
          <div class="text-muted">răspunde...</div>
        </form>
      </li>
      <li
        v-if="comments.loading === true"
        class="text-center"
      >
        <b-spinner variant="warning" label="Loading..."></b-spinner>
      </li>
    </ul>
  </div>
</template>

<script>
import BSpinner from 'bootstrap-vue/es/components/spinner/spinner';
import CommentsListComment from "./CommentsListComment.vue";

export default {
  name: 'CommentsList',

  components: {
    BSpinner,
    CommentsListComment
  },

  props: {
    comments: {
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./../scss/app-component.scss";
@import "~bootstrap/scss/spinners";

.form-reply {
  padding: map-get($spacers, 4);
  margin-bottom: map-get($spacers, 4);
  background-color: $white;
  box-shadow: $box-shadow-sm;
}

.list-comments {
  @include list-unstyled;

  ul {
    @include list-unstyled;
  }

  > li {
    padding: map-get($spacers, 4);
    margin-bottom: map-get($spacers, 4);
    background-color: $white;
    box-shadow: $box-shadow-sm;

    > * + * {
      margin-top: $spacer;
    }

    > ul {
      padding-top: $spacer;
      padding-right: map-get($spacers, 4);
      padding-left: map-get($spacers, 4);
      margin-right: -(map-get($spacers, 4));
      margin-left: -(map-get($spacers, 4));
      border-top: $border-width solid $border-color;

      > li + li {
        margin-top: $spacer;
      }
    }
  }

  .form-reply {
    padding: 0;
    margin-bottom: 0;
    box-shadow: none;

    .text-muted {
      font-size: $font-size-sm;
    }
  }
}
</style>
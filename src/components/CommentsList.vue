<template>
  <div>
    <CommentsListForm :data="{singleId: data.single.id}" />

    <ul class="list-comments">
      <li
        v-for="(comment, index) in data.comments.data" :key="'comments-comment-' + comment.commentId"
      >
        <CommentsListComment :comment="comment" />

        <ul v-if="comment.replies && comment.replies.nodes.length">
          <li
            v-for="comment in comment.replies.nodes" :key="'comments-comment-l1-' + comment.commentId"
          >
            <CommentsListComment :comment="comment" />
          </li>
        </ul>

        <CommentsListForm
          :data="{
            label: 'răspunde...',
            singleId: data.single.id,
            commentId: comment.commentId,
            index
          }"
        />
      </li>
      <li
        v-if="data.comments.loading === true"
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
import CommentsListForm from "./CommentsListForm.vue";

export default {
  name: 'CommentsList',

  components: {
    BSpinner,
    CommentsListComment,
    CommentsListForm
  },

  props: {
    currentPath: {
      type: String
    }
  },

  computed: {
    data() {
      let page = this.$store.state.data.find(obj => obj[this.currentPath]);
      return (typeof page !== 'undefined') ? page[this.currentPath] : false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./../scss/app-component.scss";
@import "~bootstrap/scss/spinners";

.list-comments {
  &,
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
}
</style>
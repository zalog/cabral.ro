<template>
  <div class="comment">
    <div class="comment-header">
      <div v-html="printAuthor(comment)" />
      <div>{{ printDate(comment) }}</div>
    </div>
    <div
      class="comment-content"
      v-html="comment.content"
    />
  </div>
</template>

<script>
export default {
  name: 'CommentsListComment',

  props: {
    comment: {
      type: Object
    }
  },

  methods: {
    printAuthor(comment) {
      let output = comment.author.name;
      if (comment.author.url) output = `<a href="${comment.author.url}" target="_blank">${output}</a>`;

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

.comment {
  color: $gray-700;

  /deep/ {
    a {
      color: $gray-700;
    }
  }
}

.comment-header {
  div:first-child {
    font-weight: bold;
  }
  div:last-child {
    font-size: $font-size-sm;
    color: $gray-600;
  }
}

.comment-content {
  /deep/ {
    p {
      word-wrap: break-word;
    }

    > p:last-child {
      margin-bottom: 0;
    }
  }
}
</style>

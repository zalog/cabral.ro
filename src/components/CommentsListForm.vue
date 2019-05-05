<template>
  <form class="form-reply">
    <div class="text-muted">{{ label }}</div>
  </form>
</template>

<script>
export default {
  name: 'CommentsListForm',

  props: {
    label: {
      type: String,
      default: 'Lasă un comentariu...'
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./../scss/app-component.scss";

.form-reply {
  padding: map-get($spacers, 4);
  margin-bottom: map-get($spacers, 4);
  background-color: $white;
  box-shadow: $box-shadow-sm;
}

.list-comments {
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

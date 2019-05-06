<template>
  <form
    class="form-reply"
    novalidate
    @click="formOpen"
    @submit.prevent="formSubmit"
  >
    <div class="label text-muted">{{ label }}</div>

    <div class="form">
      <div class="form-group">
        <label for="form-reply-message" class="sr-only">Mesaj</label>
        <textarea v-model="form.message" id="form-reply-message" class="form-control" rows="4" placeholder="Mesajul tău..." required></textarea>
      </div>
      <div
        class="form-row"
        v-if="form.message"
      >
        <div class="form-group col-sm-4">
          <label for="form-reply-name" class="sr-only">Nume</label>
          <input type="text" v-model="form.name" id="form-reply-name" class="form-control" placeholder="Nume" required>
        </div>
        <div class="form-group col-sm-4">
          <label for="form-reply-email" class="sr-only">Email</label>
          <input type="email" v-model="form.email" id="form-reply-email" class="form-control" placeholder="Email" required>
        </div>
        <div class="form-group col-sm-4">
          <label for="form-reply-site" class="sr-only">Site</label>
          <input type="url" v-model="form.site" id="form-reply-site" class="form-control" placeholder="Site">
        </div>
      </div>

      <button
        v-ripple
        type="submit"
        class="btn btn-outline-secondary"
      >Trimite</button>
    </div>
  </form>
</template>

<script>
import { postComment } from "./../services/comments.js";

export default {
  name: 'CommentsListForm',

  props: {
    label: {
      type: String,
      default: 'Lasă un comentariu...'
    }
  },

  data: () => ({
    form: {}
  }),

  methods: {
    formOpen() {
      if (this.$el.classList.contains('open')) return;

      this.$el.classList.add('open');
      document.body.addEventListener('click', this.formClose);
    },
    formClose(event) {
      const selfClicked = event.target.closest('.form-reply') === this.$el;

      if (selfClicked) return;

      this.$el.classList.remove('open');
      document.body.removeEventListener('click', this.formClose);
    },
    formSubmit() {
      postComment({ ...this.form });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./../scss/app-component.scss";
@import "~bootstrap/scss/forms";
@import "~bootstrap/scss/buttons";

.form-reply {
  padding: map-get($spacers, 4);
  margin-bottom: map-get($spacers, 4);
  background-color: $white;
  box-shadow: $box-shadow-sm;

  .label,
  .form {
    transition: max-height .2s ease, opacity .2s ease;
    overflow: hidden;
  }

  .label {
    max-height: 30px;
  }

  .form {
    max-height: 0;
    opacity: 0;
  }

  &.open {
    .label {
      max-height: 0;
      opacity: 0;
    }
    .form {
      max-height: 350px;
      opacity: 1;
      overflow: visible;
    }
  }
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

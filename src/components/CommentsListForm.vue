<template>
  <form
    class="form-reply"
    novalidate
    @click="formOpen"
    @submit.prevent="formSubmit"
  >
    <div class="label text-muted">{{ data.label || 'Lasă un comentariu...' }}</div>

    <div class="form">
      <div class="form-group">
        <label for="form-reply-message" class="sr-only">Comentariu</label>
        <textarea
          v-model="form.message"
          id="form-reply-message"
          :class="['form-control', {'is-invalid': $v.form.message.$error }]"
          rows="4" placeholder="Scrie comentariul tău aici..." required
        ></textarea>
      </div>
      <div
        class="form-row"
        v-if="form.message || form.name || form.email || form.site"
      >
        <div class="form-group col-sm-4">
          <label for="form-reply-name" class="sr-only">Nume</label>
          <input type="text"
            v-model="form.name"
            id="form-reply-name"
            :class="['form-control', {'is-invalid': $v.form.name.$error}]"
            placeholder="Nume" required
          >
        </div>
        <div class="form-group col-sm-4">
          <label for="form-reply-email" class="sr-only">Email</label>
          <input type="email"
            v-model="form.email"
            id="form-reply-email"
            :class="['form-control', {'is-invalid': $v.form.email.$error}]"
            placeholder="Email" required
          >
        </div>
        <div class="form-group col-sm-4">
          <label for="form-reply-site" class="sr-only">Site</label>
          <input type="url"
            v-model="form.site"
            id="form-reply-site"
            :class="['form-control', {'is-invalid': $v.form.site.$error}]"
            placeholder="Site"
          >
        </div>
      </div>

      <div
         v-if="$v.form.$error"
        class="alert alert-warning" role="alert"
      >
        Câmpurile marcate cu roșu conțin erori.
      </div>

      <button
        v-ripple
        type="submit"
        class="btn btn-outline-secondary d-flex align-items-center"
        :disabled="form.loading"
      >
        <span v-if="form.loading" class="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
        <span v-text="(!form.loading) ? 'Trimite' : 'se trimite...'" />
      </button>
    </div>
  </form>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email, minLength, url } from "vuelidate/lib/validators";
import { postComment } from "./../services/comments.js";

export default {
  name: 'CommentsListForm',

  mixins: [validationMixin],

  props: {
    data: {
      type: Object
    }
  },

  data: () => ({
    form: {
      loading: false
    }
  }),

  validations: {
    form: {
      message: { required, min: minLength(3) },
      name: { required, min: minLength(3) },
      email: { required, email },
      site: { url }
    }
  },

  methods: {
    formOpen() {
      if (this.$el.classList.contains('open')) return;


      this.$el.classList.add('open');
      this.$el.querySelector('#form-reply-message').focus();
      document.body.addEventListener('click', this.formClose);
    },
    formClose(event) {
      const selfClicked = event.target.closest('.form-reply') === this.$el;

      if (selfClicked) return;

      this.$el.classList.remove('open');
      document.body.removeEventListener('click', this.formClose);
    },
    formSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$error) return;

      this.form.loading = true;

      postComment({
        singleId: this.data.singleId,
        commentId: this.data.commentId,
        ...this.form
      }).then(() => {
        setTimeout(() => this.$el.classList.remove('open'), 2000);
      }).finally(() => {
        this.form.loading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./../scss/app-component.scss";
@import "~bootstrap/scss/forms";
@import "~bootstrap/scss/buttons";
@import "~bootstrap/scss/alert";

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
      max-height: 500px;
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

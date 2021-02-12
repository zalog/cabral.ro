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
                <label :for="getIdSuffix('form-reply-message')" class="sr-only">Comentariu</label>
                <textarea
                    v-model="form.data.message"
                    :id="getIdSuffix('form-reply-message')"
                    :class="['form-control', {'is-invalid': $v.form.data.message.$error }]"
                    rows="4" placeholder="Scrie comentariul tău aici..." required
                />
            </div>
            <div
                v-if="form.data.message || form.data.name || form.data.email || form.data.site"
                class="form-row"
            >
                <div class="form-group col-sm-4">
                    <label for="form-reply-name" class="sr-only">Nume</label>
                    <input
                        v-model="form.data.name"
                        type="text"
                        id="form-reply-name"
                        :class="['form-control', {'is-invalid': $v.form.data.name.$error}]"
                        placeholder="Nume" required
                    >
                </div>
                <div class="form-group col-sm-4">
                    <label for="form-reply-email" class="sr-only">Email</label>
                    <input
                        v-model="form.data.email"
                        type="email"
                        id="form-reply-email"
                        :class="['form-control', {'is-invalid': $v.form.data.email.$error}]"
                        placeholder="Email" required
                    >
                </div>
                <div class="form-group col-sm-4">
                    <label for="form-reply-site" class="sr-only">Site</label>
                    <input
                        v-model="form.data.site"
                        type="url"
                        id="form-reply-site"
                        :class="['form-control', {'is-invalid': $v.form.data.site.$error}]"
                        placeholder="Site"
                    >
                </div>
            </div>

            <div
                v-if="$v.form.data.$error"
                class="alert alert-warning" role="alert"
            >
                Câmpurile marcate cu roșu conțin erori.
            </div>

            <button
                type="submit"
                class="btn btn-outline-secondary d-flex align-items-center"
                :disabled="form.loading"
            >
                <span
                    v-if="form.loading"
                    class="spinner-border spinner-border-sm mr-1"
                    role="status"
                    aria-hidden="true"
                />
                <span v-text="(!form.loading) ? 'Trimite' : 'se trimite...'" />
            </button>
        </div>
    </form>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email, minLength, url } from 'vuelidate/lib/validators';

export default {
    name: 'CommentsListForm',

    mixins: [validationMixin],

    props: {
        data: {
            type: Object,
        },
    },

    data: () => ({
        form: {
            data: {},
            loading: false,
        },
    }),

    validations: {
        form: {
            data: {
                message: { required, min: minLength(3) },
                name: { required, min: minLength(3) },
                email: { required, email },
                site: { url },
            },
        },
    },

    methods: {
        formOpen() {
            if (this.$el.classList.contains('open')) return;

            this.$el.classList.add('open');
            this.$el.querySelector('textarea').focus();
            document.body.addEventListener('click', this.formClose);
        },
        formClose(event) {
            const selfClicked = event.target.closest('.form-reply') === this.$el;

            if (selfClicked) return;

            this.$el.classList.remove('open');
            document.body.removeEventListener('click', this.formClose);
        },
        formSubmit() {
            this.$v.form.data.$touch();
            if (this.$v.form.data.$error) return;

            this.form.loading = true;

            this.$store.dispatch('data/postComment', {
                route: this.$route,
                index: this.data.index,
                params: {
                    singleId: this.data.singleId,
                    commentId: this.data.commentId,
                    ...this.form.data,
                },
            }).then((commentId) => {
                let elComment = document.getElementById(`comment-${commentId}`);

                this.form.data.message = null;
                this.$v.form.data.$reset();
                elComment && elComment.classList.add('highlight-background');
                setTimeout(() => this.$el.classList.remove('open'), 2000);
            }).catch(() => {
                // empty catch
            }).finally(() => {
                this.form.loading = false;
            });
        },
        getIdSuffix(string, commentId = this.data.commentId) {
            return (commentId) && `${string}-${commentId}` || string;
        },
    },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/app-component.scss";
@import "~bootstrap/scss/alert";

.form-reply {
    padding: map-get($spacers, 4);
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
        box-shadow: none;
        background-color: transparent;

        .text-muted {
            font-size: $font-size-sm;
        }
    }
}
</style>

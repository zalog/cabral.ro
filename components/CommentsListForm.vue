<template>
    <form
        class="form-reply"
        novalidate
        @click="formOpen"
        @submit.prevent="formSubmit"
    >
        <div class="label text-muted">
            {{ data.label || 'Lasă un comentariu la acest articol...' }}
        </div>

        <div class="form">
            <div class="mb-3">
                <label
                    :for="getIdSuffix('form-reply-message')"
                    class="visually-hidden"
                >
                    Comentariu
                </label>
                <textarea
                    :id="getIdSuffix('form-reply-message')"
                    v-model="form.data.message"
                    :class="['form-control', {'is-invalid': $v.form.data.message.$error }]"
                    rows="4"
                    placeholder="Scrie comentariul tău aici..."
                    required
                />
            </div>
            <div
                v-if="form.data.message || form.data.name || form.data.email || form.data.site"
                class="form-row"
            >
                <div class="mb-3 col-sm-4">
                    <label for="form-reply-name" class="visually-hidden">Nume</label>
                    <input
                        id="form-reply-name"
                        v-model="form.data.name"
                        type="text"
                        :class="['form-control', {'is-invalid': $v.form.data.name.$error}]"
                        placeholder="Nume"
                        required
                    >
                </div>
                <div class="mb-3 col-sm-4">
                    <label for="form-reply-email" class="visually-hidden">Email</label>
                    <input
                        id="form-reply-email"
                        v-model="form.data.email"
                        type="email"
                        :class="['form-control', {'is-invalid': $v.form.data.email.$error}]"
                        placeholder="Email"
                        required
                    >
                </div>
                <div class="mb-3 col-sm-4">
                    <label for="form-reply-site" class="visually-hidden">Site</label>
                    <input
                        id="form-reply-site"
                        v-model="form.data.site"
                        type="url"
                        :class="['form-control', {'is-invalid': $v.form.data.site.$error}]"
                        placeholder="Site"
                    >
                </div>
            </div>

            <base-alert
                v-if="$v.form.data.$error"
                variant="danger"
            >
                Câmpurile marcate cu roșu conțin erori.
            </base-alert>

            <button
                type="submit"
                class="btn btn-outline-secondary d-flex align-items-center"
                :disabled="form.loading"
            >
                <base-spinner
                    v-if="form.loading"
                    class="mr-1"
                    size="sm"
                />
                <span v-text="(!form.loading) ? 'Trimite' : 'se trimite...'" />
            </button>
        </div>
    </form>
</template>

<script>
import { validationMixin } from 'vuelidate';
import {
    required, email, minLength, url,
} from 'vuelidate/lib/validators';
import BaseAlert from '~/components/BaseAlert.vue';
import BaseSpinner from '~/components/BaseSpinner.vue';

export default {
    components: {
        BaseAlert,
        BaseSpinner,
    },

    mixins: [validationMixin],

    props: {
        data: {
            type: Object,
            default: () => ({}),
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
                const elComment = document.getElementById(`comment-${commentId}`);

                this.form.data.message = null;
                this.$v.form.data.$reset();
                if (elComment) elComment.classList.add('highlight-background');
                setTimeout(() => this.$el.classList.remove('open'), 2000);
            }).catch(() => {
                // empty catch
            }).finally(() => {
                this.form.loading = false;
            });
        },
        getIdSuffix(string, commentId = this.data.commentId) {
            return (commentId && `${string}-${commentId}`) || string;
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/comments-list-form";
</style>

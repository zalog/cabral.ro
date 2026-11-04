<template>
    <form
        class="group"
        :class="isReply
            ? '-mt-6 bg-gray-100 px-6 pt-4 pb-6'
            : 'sticky top-0 z-1020 bg-white p-6 shadow-md'"
        novalidate
        @click="formOpen"
        @keyup="formOpen"
        @submit.prevent="formSubmit"
    >
        <div
            class="max-h-[30px] overflow-hidden text-gray-900/75 transition-[max-height,opacity] duration-200 ease-[ease] group-[.open]:max-h-0 group-[.open]:opacity-0"
            :class="{ 'text-sm': isReply }"
        >
            {{ data.label || 'Lasă un comentariu la acest articol...' }}
        </div>

        <div class="max-h-0 overflow-hidden opacity-0 transition-[max-height,opacity] duration-200 ease-[ease] group-[.open]:max-h-[500px] group-[.open]:overflow-visible group-[.open]:opacity-100">
            <div class="mb-4">
                <label
                    :for="getIdSuffix('form-reply-message')"
                    class="sr-only"
                >
                    Comentariu
                </label>
                <textarea
                    :id="getIdSuffix('form-reply-message')"
                    v-model="form.data.message"
                    :class="fieldClass(v$.form.data.message.$error, true)"
                    rows="4"
                    placeholder="Scrie comentariul tău aici..."
                    required
                />
            </div>
            <div v-if="form.data.message || form.data.name || form.data.email || form.data.site">
                <div class="mb-4 sm:w-1/3">
                    <label
                        for="form-reply-name"
                        class="sr-only"
                    >Nume</label>
                    <input
                        id="form-reply-name"
                        v-model="form.data.name"
                        type="text"
                        :class="fieldClass(v$.form.data.name.$error)"
                        placeholder="Nume"
                        required
                    >
                </div>
                <div class="mb-4 sm:w-1/3">
                    <label
                        for="form-reply-email"
                        class="sr-only"
                    >Email</label>
                    <input
                        id="form-reply-email"
                        v-model="form.data.email"
                        type="email"
                        :class="fieldClass(v$.form.data.email.$error)"
                        placeholder="Email"
                        required
                    >
                </div>
                <div class="mb-4 sm:w-1/3">
                    <label
                        for="form-reply-site"
                        class="sr-only"
                    >Site</label>
                    <input
                        id="form-reply-site"
                        v-model="form.data.site"
                        type="url"
                        :class="fieldClass(v$.form.data.site.$error)"
                        placeholder="Site"
                    >
                </div>
            </div>

            <base-alert
                v-if="v$.form.data.$error"
                variant="danger"
                class="mb-4"
            >
                Câmpurile marcate cu roșu conțin erori.
            </base-alert>

            <button
                type="submit"
                class="flex items-center rounded-md border border-secondary px-3 py-1.5 text-center align-middle text-secondary transition-[color,background-color,border-color,box-shadow] duration-150 ease-in-out select-none hover:bg-secondary hover:text-white focus-visible:ring-4 focus-visible:ring-secondary/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-65"
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
import { reactive } from 'vue';
import useVuelidate from '@vuelidate/core';
import {
    required, email, minLength, url,
} from '@vuelidate/validators';
import BaseAlert from '~/components/BaseAlert.vue';
import BaseSpinner from '~/components/BaseSpinner.vue';

export default {
    components: {
        BaseAlert,
        BaseSpinner,
    },

    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
    },

    setup() {
        const form = reactive({
            data: {},
            loading: false,
        });
        const v$ = useVuelidate({
            form: {
                data: {
                    message: { required, min: minLength(3) },
                    name: { required, min: minLength(3) },
                    email: { required, email },
                    site: { url },
                },
            },
        }, { form });

        return { form, v$ };
    },

    computed: {
        isReply() {
            return !!this.data.commentId;
        },
    },

    methods: {
        fieldClass(invalid, multiline = false) {
            const base = 'block w-full appearance-none rounded-md border bg-white bg-clip-padding px-3 py-1.5 text-gray-900 transition-[border-color,box-shadow] duration-150 ease-in-out placeholder:text-gray-600 focus:ring-4 focus:outline-none';

            if (!invalid) return [base, 'border-gray-400 focus:border-primary-300 focus:ring-primary/25'];

            return [
                base,
                'border-danger bg-(image:--icon-invalid) bg-size-[calc(.75em+.375rem)] bg-no-repeat pr-[calc(1.5em+.75rem)] focus:ring-danger/25',
                multiline
                    ? 'bg-position-[right_calc(.375em+.1875rem)_top_calc(.375em+.1875rem)]'
                    : 'bg-position-[right_calc(.375em+.1875rem)_center]',
            ];
        },
        formOpen() {
            if (this.$el.classList.contains('open')) return;

            this.$el.classList.add('open');
            this.$el.querySelector('textarea').focus();
            document.body.addEventListener('click', this.formClose);
        },
        formClose(event) {
            if (this.$el.contains(event.target)) return;

            this.$el.classList.remove('open');
            document.body.removeEventListener('click', this.formClose);
        },
        formSubmit() {
            this.v$.form.data.$touch();
            if (this.v$.form.data.$error) return;

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
                this.v$.form.data.$reset();
                if (elComment) elComment.classList.add('animate-highlight');
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

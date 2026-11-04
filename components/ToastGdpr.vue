<template>
    <base-toast
        v-if="!cookieConsent"
        no-auto-hide
    >
        <p class="mb-2">
            Acest web site folosește cookie-uri pentru a furniza serviciile
            și pentru a analiza traficul,
            <nuxt-link
                to="/politica-de-acord-colectare-cookie/"
                class="text-primary-200"
            >
                {{ 'detalii' }}
            </nuxt-link>.
        </p>
        <button
            class="inline-block rounded-sm border border-secondary bg-secondary px-2 py-1 text-center align-middle text-sm text-white transition-[color,background-color,border-color,box-shadow] duration-150 ease-in-out select-none focus-visible:ring-4 focus-visible:ring-gray-700/50 focus-visible:outline-none"
            @click="onClickAgree()"
        >
            Ok, am înțeles
        </button>
    </base-toast>
</template>

<script>
import { useCookie } from '#imports';
import BaseToast from './BaseToast.vue';

export default {
    components: {
        BaseToast,
    },

    setup: () => ({
        cookieConsent: useCookie('cookie-consent-user-accepted', {
            maxAge: 60 * 60 * 24 * 180,
        }),
    }),

    methods: {
        onClickAgree() {
            this.cookieConsent = true;
        },
    },
};
</script>

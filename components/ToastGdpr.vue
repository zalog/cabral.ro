<template>
    <base-toast
        v-if="!cookieConsent"
        toast-class="toast-gdpr"
        no-auto-hide
    >
        <p>
            Acest web site folosește cookie-uri pentru a furniza serviciile
            și pentru a analiza traficul,
            <nuxt-link to="/politica-de-acord-colectare-cookie/">
                {{ 'detalii' }}
            </nuxt-link>.
        </p>
        <button
            class="btn btn-sm btn-secondary"
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

<style lang="scss">
@use "~/assets/scss/05-components/toast-gdpr";
</style>

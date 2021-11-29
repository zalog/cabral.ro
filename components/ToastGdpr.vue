<template>
    <base-toast
        :visible="visible"
        toast-class="toast-gdpr"
        no-auto-hide
    >
        <p>
            Acest web site folosește cookie-uri pentru a furniza serviciile
            și pentru a analiza traficul,
            <nuxt-link
                to="/politica-de-acord-colectare-cookie/"
                v-text="'detalii'"
            />.
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
import BaseToast from './BaseToast.vue';

export default {
    components: {
        BaseToast,
    },

    data: () => ({
        visible: true,
    }),

    methods: {
        onClickAgree() {
            this.$cookies.set('cookie-consent-user-accepted', 'true', {
                maxAge: 60 * 60 * 24 * 180, // 6 months
            });
            this.visible = false;
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/toast-gdpr";
</style>

<template>
    <div class="layout-default">
        <the-header />
        <layout-hero
            v-if="singleFeaturedMedia"
            :img="singleFeaturedMedia"
        />
        <div class="container-fluid">
            <Nuxt class="page" />
        </div>
        <the-footer />
        <lazy-the-notifications />
    </div>
</template>

<script>
import LayoutHero from '~/components/LayoutHero.vue';

export default {
    components: {
        LayoutHero,
    },

    computed: {
        data() {
            const pageKey = this.$route.fullPath;
            return this.$store.getters['data/currentPage'](pageKey);
        },
        singleFeaturedMedia() {
            if (this.$route.name !== 'Single') return false;

            return this.data.main?.featuredMedia;
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/07-trumps/layout-default";
</style>

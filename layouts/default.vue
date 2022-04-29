<template>
    <div class="layout-default">
        <the-header />
        <layout-hero
            v-if="$route.name === 'Single' && data.main.featuredMedia"
            :img="data.main.featuredMedia"
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
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/07-trumps/layout-default";
</style>

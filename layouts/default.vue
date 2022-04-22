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
import { currentPage } from '~/mixins';
import LayoutHero from '~/components/LayoutHero.vue';

export default {
    components: {
        LayoutHero,
    },

    mixins: [
        currentPage,
    ],
};
</script>

<style lang="scss">
@import "~/assets/scss/07-trumps/layout-default";
</style>

<template>
    <div class="layout-default">
        <the-header />
        <layout-hero
            v-if="$route.name === 'Single' && data.main.featuredMedia"
            :img="data.main.featuredMedia"
        />
        <div class="container-fluid">
            <div class="row">
                <div class="d-none d-xl-block col-xl-3 sidebar">
                    <portal-target name="widget-categories" />
                </div>
                <Nuxt
                    class="page"
                    :class="[
                        'col-12',
                        'offset-sm-1', 'col-sm-10',
                        'offset-lg-2', 'col-lg-8',
                        'offset-xl-0', 'col-xl-6',
                    ]"
                />
            </div>
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

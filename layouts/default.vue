<template>
    <div class="flex min-h-screen flex-col">
        <the-header />
        <layout-hero
            v-if="singleFeaturedMedia"
            :img="singleFeaturedMedia"
        />
        <div class="flex grow flex-col p-3 sm:py-6">
            <slot />
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
            if (!['Single', 'SingleNested'].includes(this.$route.name)) return false;

            return this.data.main?.featuredMedia;
        },
    },
};
</script>

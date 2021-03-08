<template>
    <div
        v-if="data"
        class="container-fluid"
    >
        <h1
            v-if="showPageTitle(data.title)"
            class="mb-4"
        >
            {{ data.title }}
        </h1>
        <posts-list
            :posts="data.main"
        />
    </div>
</template>

<script>
import { SITE } from '~/utils/constants';
import dataListing from '~/store/lazy/data-listing';
import dataHead from '~/store/lazy/data-head';
import { currentPage } from '~/mixins';
import PostsList from '~/components/PostsList.vue';

export default {
    components: {
        PostsList,
    },

    mixins: [
        currentPage,
    ],

    async asyncData({ store, route }) {
        if (!store.hasModule(['data', 'dataListing'])) {
            store.registerModule(['data', 'dataListing'], dataListing, { preserveState: true });
        }
        if (!store.hasModule(['data', 'dataHead'])) {
            store.registerModule(['data', 'dataHead'], dataHead, { preserveState: true });
        }

        const pageS = route.query.s;
        let fetchHeadUrl = `${SITE.LINK}/`;
        if (pageS) fetchHeadUrl += `?s=${pageS}`;

        await Promise.all([
            store.dispatch('data/fetchHead', {
                route,
                url: fetchHeadUrl,
            }),
            store.dispatch('data/fetchPageListing', {
                route,
            }),
        ]);
    },

    watchQuery: ['s'],

    beforeDestroy() {
        this.$store.unregisterModule(['data', 'dataListing']);
    },

    methods: {
        showPageTitle(title) {
            return title !== SITE.TITLE;
        },
    },
};
</script>

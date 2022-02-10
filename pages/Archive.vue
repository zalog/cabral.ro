<template>
    <div
        v-if="data"
        class="container-fluid"
    >
        <h1
            v-if="data.title"
            class="mb-4"
        >
            {{ data.title }}
        </h1>
        <div
            v-if="data.description"
            class="mt-n3 mb-4"
            v-html="data.description/* eslint-disable-line vue/no-v-html */"
        />
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

        const { categorySlug } = route.params;

        await Promise.all([
            store.dispatch('data/fetchHead', {
                route,
                url: `${SITE.LINK}/category/${categorySlug}/`,
            }),
            store.dispatch('data/fetchPageListing', {
                route,
                categories: [categorySlug],
            }),
        ]);
    },

    watchQuery: ['s'],

    beforeDestroy() {
        this.$store.unregisterModule(['data', 'dataListing']);
    },
};
</script>

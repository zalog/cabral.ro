<template>
    <div v-if="data">
        <h1
            v-if="data.title"
            class="mb-6"
        >
            {{ data.title }}
        </h1>
        <div
            v-if="data.description"
            class="mb-6"
            v-html="data.description/* eslint-disable-line vue/no-v-html */"
        />
        <posts-list
            :posts="data.main"
            class="mb-12"
        />
    </div>
</template>

<script>
import { defineNuxtComponent, useRoute } from '#imports';
import dataListing from '~/store/lazy/data-listing';
import useCurrentPage from '~/composables/useCurrentPage';
import PostsList from '~/components/PostsList.vue';

const registerModules = (store) => {
    store.$registerModules([
        { name: ['data', 'dataListing'], imported: dataListing, preserveStateCheck: true },
    ]);
};

export default defineNuxtComponent({
    components: {
        PostsList,
    },

    setup() {
        return useCurrentPage();
    },

    async asyncData({ $store: store }) {
        const route = { ...useRoute() };

        registerModules(store);

        const { pathMatch, slug } = route.params;
        const [pageSlug, pageNumber] = slug.split('/page/');

        await store.dispatch('data/fetchPageListing', {
            route,
            term: {
                taxonomy: (pathMatch === 'tag') ? 'tag' : 'category',
                slug: pageSlug.split('/').pop(),
            },
            pageNumber,
        });

        return {};
    },

    mounted() {
        registerModules(this.$store);
    },
});
</script>

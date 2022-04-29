<template>
    <div v-if="data">
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

const registerModules = (store) => {
    store.$registerModules([
        { name: ['data', 'dataListing'], imported: dataListing, preserveStateCheck: true },
        { name: ['data', 'dataHead'], imported: dataHead, preserveStateCheck: true },
    ]);
};

export default {
    components: {
        PostsList,
    },

    mixins: [
        currentPage,
    ],

    async asyncData({ store, route }) {
        registerModules(store);

        const { pathMatch, slug } = route.params;
        const [pageSlug, pageNumber] = slug.split('/page/');
        const taxonomyName = (pathMatch === 'tag') ? 'tag' : 'category';

        await Promise.all([
            store.dispatch('data/fetchHead', {
                route,
                url: `${SITE.LINK}/${pathMatch}/${pageSlug}/`,
            }),
            store.dispatch('data/fetchPageListing', {
                route,
                taxonomy: {
                    [taxonomyName]: pageSlug,
                },
                pageNumber,
            }),
        ]);
    },

    mounted() {
        registerModules(this.$store);
    },
};
</script>

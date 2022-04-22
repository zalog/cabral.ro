<template>
    <div v-if="data">
        <h1
            v-if="showPageTitle(data.title)"
            class="mb-4"
        >
            {{ data.title }}
        </h1>

        <base-alert>
            Susțin <a href="https://www.anvelope.ro/" target="_blank" rel="external nofollow noopener">anvelope.ro</a>, specialistul meu în anvelope.
        </base-alert>

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
import BaseAlert from '~/components/BaseAlert.vue';
import PostsList from '~/components/PostsList.vue';

const registerModules = (store) => {
    store.$registerModules([
        { name: ['data', 'dataListing'], imported: dataListing, preserveStateCheck: true },
        { name: ['data', 'dataHead'], imported: dataHead, preserveStateCheck: true },
    ]);
};

export default {
    components: {
        BaseAlert,
        PostsList,
    },

    mixins: [
        currentPage,
    ],

    async asyncData({ store, route }) {
        registerModules(store);

        const { id: pageNumber } = route.params;
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
                pageNumber,
            }),
        ]);
    },

    watchQuery: ['s'],

    mounted() {
        registerModules(this.$store);
    },

    methods: {
        showPageTitle(title) {
            return title !== SITE.TITLE;
        },
    },
};
</script>

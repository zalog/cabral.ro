<template>
    <div v-if="data">
        <h1
            v-if="showPageTitle(data.title)"
            class="mb-6"
        >
            {{ data.title }}
        </h1>

        <base-alert class="mb-12">
            Susțin <a
                href="https://www.anvelope.ro/"
                target="_blank"
                rel="external noopener"
            >anvelope.ro</a>, specialistul meu în anvelope.
        </base-alert>

        <posts-list
            :posts="data.main"
            class="mb-12"
        />
    </div>
</template>

<script>
import { defineNuxtComponent, useRoute } from '#imports';
import { SITE } from '~/utils/constants';
import dataListing from '~/store/lazy/data-listing';
import dataHead from '~/store/lazy/data-head';
import useCurrentPage from '~/composables/useCurrentPage';
import BaseAlert from '~/components/BaseAlert.vue';
import PostsList from '~/components/PostsList.vue';

const registerModules = (store, pageS) => {
    const modules = [
        { name: ['data', 'dataListing'], imported: dataListing, preserveStateCheck: true },
    ];

    if (!pageS) {
        modules.push(
            { name: ['data', 'dataHead'], imported: dataHead, preserveStateCheck: true },
        );
    }

    store.$registerModules(modules);
};

// Yoast has no head for search pages
const searchHead = (pageS) => {
    if (!pageS) return {};

    return {
        title: `Caută după "${pageS}" - ${SITE.TITLE.toLowerCase()}`,
        meta: [{
            name: 'robots',
            content: 'noindex, follow',
        }],
    };
};

export default defineNuxtComponent({
    components: {
        BaseAlert,
        PostsList,
    },

    setup() {
        const route = useRoute();

        return useCurrentPage({ head: () => searchHead(route.query.s) });
    },

    async asyncData({ $store: store }) {
        const route = { ...useRoute() };
        const { id: pageNumber } = route.params;
        const pageS = route.query.s;

        registerModules(store, pageS);

        const actions = [
            store.dispatch('data/fetchPageListing', {
                route,
                pageNumber,
            }),
        ];

        if (!pageS) {
            actions.push(
                store.dispatch('data/fetchHead', {
                    route,
                    url: `${SITE.LINK}/`,
                }),
            );
        }

        await Promise.all(actions);

        return {};
    },

    mounted() {
        registerModules(this.$store, this.$route.query.s);
    },

    methods: {
        showPageTitle(title) {
            return title !== SITE.TITLE;
        },
    },
});
</script>

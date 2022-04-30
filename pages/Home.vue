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

const registerModules = (store, pageS) => {
    const modules = [
        { name: ['data', 'dataListing'], imported: dataListing, preserveStateCheck: true },
    ];

    if (!pageS) {
        modules.push(
            { name: ['data', 'dataHead'], imported: dataHead, preserveStateCheck: true }
        );
    }

    store.$registerModules(modules);
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

        const data = {};

        if (pageS) {
            // TODO get search pages head data from api and remove this
            data.head = {
                title: `Caută după "${pageS}" - ${SITE.TITLE.toLowerCase()}`,
                meta: [{
                    name: 'robots',
                    content: 'noindex, follow',
                }],
            };
        }

        return data;
    },

    data: () => ({
        head: {},
    }),

    watchQuery: ['s'],

    mounted() {
        registerModules(this.$store, this.$route.query.s);
    },

    methods: {
        showPageTitle(title) {
            return title !== SITE.TITLE;
        },
    },
};
</script>

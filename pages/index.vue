<template>
    <div
        v-if="data.sections && data.sections.main.posts"
        class="page-home container-fluid py-5"
    >
        <h1
            v-if="showPageTitle(data.sections.main.title)"
            v-html="data.sections.main.title"
            class="mb-4"
        />
        <posts-list
            :posts="data.sections.main.posts"
        />
    </div>
</template>

<script>
import { SITE } from '~/utils/constants';
import dataPosts from '~/store/lazy/data-posts';
import { currentPage } from '~/mixins';
import PostsList from '~/components/PostsList.vue';

export default {
    components: {
        PostsList
    },

    mixins: [
        currentPage
    ],

    async asyncData({ store, route }) {
        local.registerModule({ store, preserveState: false });

        await store.dispatch('data/fetchPageHome', {
            route
        });
    },

    methods: {
        showPageTitle(title) {
            return title !== SITE.TITLE;
        }
    }
};

const local = {
    registerModule: function({ store, preserveState }) {
        if (!store.hasModule(['data', 'dataPosts'])) {
            store.registerModule(['data', 'dataPosts'], dataPosts, { preserveState });
        }
    }
};
</script>

<template>
    <div
        v-if="data"
        class="page-home container-fluid py-5"
    >
        <h1
            v-if="showPageTitle(data.main.title)"
            v-html="data.main.title"
            class="mb-4"
        />
        <posts-list
            :posts="data.main.posts"
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
        store.registerModule(['data', 'dataPosts'], dataPosts);

        await store.dispatch('data/fetchPageHome', {
            route
        });
    },

    beforeDestroy() {
        this.$store.unregisterModule(['data', 'dataPosts']);
    },

    methods: {
        showPageTitle(title) {
            return title !== SITE.TITLE;
        }
    }
};
</script>

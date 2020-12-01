<template>
    <div
        v-if="data.sections && data.category"
        class="page-category container-fluid py-5"
    >
        <h1
            v-html="pageTitle"
            class="mb-4"
        />
        <div
            v-if="data.category.description"
            v-html="data.category.description"
            class="mt-n3 mb-4"
        />
        <posts-list
            :posts="data.sections.main.posts"
        />
    </div>
</template>

<script>
import { currentPage, datalayerPage } from './../utils/mixins';
import PostsList from './../components/PostsList.vue';

export default {
    name: 'PageCategory',

    components: {
        PostsList
    },

    mixins: [
        currentPage,
        datalayerPage
    ],

    watch: {
        '$route': 'fetchPage'
    },

    serverPrefetch() {
        return this.fetchPage();
    },

    beforeMount() {
        this.fetchPage();
    },

    methods: {
        async fetchPage() {
            const categorySlug = this.$route.params.categorySlug.split('/').pop();

            await this.$store.dispatch('data/fetchPageCategory', {
                slug: categorySlug
            });

            this.afterDataLoaded();
        },
        afterDataLoaded() {
            if (typeof window === 'undefined') return;

            this.datalayerPageview(this.pageTitle);
        }
    }
};
</script>

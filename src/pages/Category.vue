<template>
    <div
        v-if="data.posts && data.category"
        class="page-category container-fluid py-5"
    >
        <h1
            v-html="currentPageTitle"
            class="mb-4"
        />
        <div
            v-if="data.category.description"
            v-html="data.category.description"
            class="mt-n3 mb-4"
        />
        <posts-list
            :posts="data.posts"
        />
    </div>
</template>

<script>
import { datalayerPage } from './../utils/mixins';
import PostsList from './../components/PostsList.vue';

export default {
    name: 'PageCategory',

    components: {
        PostsList
    },

    mixins: [
        datalayerPage
    ],

    computed: {
        data() {
            return this.$store.getters['data/currentPage']();
        },
        currentPageTitle() {
            return this.$store.getters['data/currentPageTitle']();
        }
    },

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

            this.datalayerPageview(this.currentPageTitle);
        }
    }
};
</script>

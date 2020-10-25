<template>
    <div
        v-if="data.posts && data.category"
        class="page-category container-fluid py-5"
    >
        <h1
            v-html="getPageTitle()"
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
import { formatTitle } from './../utils';
import PostsList from './../components/PostsList.vue';

export default {
    name: 'PageCategory',

    components: {
        PostsList
    },

    computed: {
        data() {
            return this.$store.getters['data/currentPage']();
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

            await this.$store.dispatch('data/fetchPosts', {
                categories: [categorySlug]
            });

            await this.$store.dispatch('data/fetchCategory', {
                params: {
                    slug: categorySlug
                }
            });

            this.afterDataLoaded();
        },
        afterDataLoaded() {
            if (typeof window === 'undefined') return;

            this.sendPageView();
        },
        sendPageView() {
            window.dataLayer.push({ event: 'pageview', title: formatTitle(this.getPageTitle()) });
        },
        getPageTitle() {
            const output = [];
            const pageName = this.data.category && this.data.category.name || false;
            const pageNumber = this.$route.params.id && `pagina ${this.$route.params.id}` || '';

            if (!pageName) return;

            output.push(pageName);
            pageNumber && output.push(pageNumber);

            return output;
        }
    },

    metaInfo() {
        return {
            title: this.getPageTitle()
        };
    }
};
</script>

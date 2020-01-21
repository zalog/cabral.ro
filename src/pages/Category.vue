<template>
    <div
        v-if="data"
        class="page-category container-fluid py-5"
    >
        <h1
            v-html="this.pageTitle"
            class="mb-4"
        />
        <posts-list
            :posts="data.posts"
        />
    </div>
</template>

<script>
import { SITE } from './../utils/constants';
import { decodeHtml } from './../utils';
import PostsList from './../components/PostsList.vue';

export default {
    name: 'PageCategory',

    components: {
        PostsList
    },

    computed: {
        data() {
            return this.$store.getters['data/currentPage']();
        },
        pageTitle() {
            let page = (this.$route.params.id) ? ` - pagina ${this.$route.params.id}` : '';
            return decodeHtml(this.$route.path + page);
        }
    },

    watch: {
        '$route': 'fetchPosts'
    },

    serverPrefetch() {
        return this.fetchPosts();
    },

    beforeMount() {
        this.fetchPosts();
    },

    methods: {
        async fetchPosts() {
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
            window.dataLayer.push({ event: 'pageview', title: SITE.TITLE_TEMPLATE(this.pageTitle) });
        }
    },

    metaInfo() {
        return {
            title: this.pageTitle
        };
    }
};
</script>

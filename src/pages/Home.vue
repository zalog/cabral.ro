<template>
    <div
        v-if="data"
        class="page-home container-fluid py-5"
    >
        <h1
            v-if="pageTitleSearch"
            v-html="pageTitleSearch"
            class="mb-4"
        />
        <PostsList
            :posts="data.posts"
        />
    </div>
</template>

<script>
import { SITE } from './../utils/constants';
import decodeHtml from './../utils/decodeHtml';
import PostsList from './../components/PostsList.vue';

export default {
    name: 'PageHome',

    components: {
        PostsList
    },

    data: () => ({
        forceDataRecompute: 1
    }),

    computed: {
        data() {
            this.forceDataRecompute;
            return this.$store.getters['data/currentPage'];
        },
        pageTitle() {
            let page = (this.$route.params.id) ? ` - pagina ${this.$route.params.id}` : '';
            let pageTitleSearch = this.pageTitleSearch && `${this.pageTitleSearch} - `;
            return decodeHtml(pageTitleSearch + SITE.TITLE + page);
        },
        pageTitleSearch() {
            let s = this.$route.query.s;
            return s && `Caută după "${s}"` || '';
        }
    },

    watch: {
        '$route'() {
            this.fetchPosts();
            this.sendPageView();
        }
    },

    metaInfo() {
        return {
            title: this.pageTitle,
            titleTemplate: false
        };
    },

    serverPrefetch() {
        return this.fetchPosts();
    },

    beforeMount() {
        this.fetchPosts();
        this.sendPageView();
    },

    methods: {
        fetchPosts() {
            return this.$store.dispatch('data/fetchPosts').then(() => {
                this.forceDataRecompute++;
            });
        },
        sendPageView() {
            window.dataLayer.push({ event: 'pageview', title: this.pageTitle });
        }
    }
};
</script>

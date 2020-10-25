<template>
    <div
        v-if="data.posts"
        class="page-home container-fluid py-5"
    >
        <h1
            v-if="pageTitleSearch"
            v-html="pageTitleSearch"
            class="mb-4"
        />
        <posts-list
            :posts="data.posts"
        />
    </div>
</template>

<script>
import { SITE } from './../utils/constants';
import PostsList from './../components/PostsList.vue';

export default {
    name: 'PageHome',

    components: {
        PostsList
    },

    computed: {
        data() {
            return this.$store.getters['data/currentPage']();
        },
        pageTitle() {
            const page = (this.$route.params.id) ? ` - pagina ${this.$route.params.id}` : '';
            const pageTitleSearch = this.pageTitleSearch && `${this.pageTitleSearch} - `;
            return pageTitleSearch + SITE.TITLE + page;
        },
        pageTitleSearch() {
            const s = this.$route.query.s;
            return s && `Caută după "${s}"` || '';
        }
    },

    watch: {
        '$route'() {
            this.fetchPage();
            this.sendPageView();
        }
    },

    serverPrefetch() {
        return this.fetchPage();
    },

    beforeMount() {
        this.fetchPage();
        this.sendPageView();
    },

    methods: {
        async fetchPage() {
            await this.$store.dispatch('data/fetchPageHome');
        },
        sendPageView() {
            window.dataLayer.push({ event: 'pageview', title: this.pageTitle });
        }
    },

    metaInfo() {
        return {
            title: this.pageTitle,
            titleTemplate: false
        };
    }
};
</script>

<template>
    <div
        v-if="data.posts"
        class="page-home container-fluid py-5"
    >
        <h1
            v-if="showPageTitle()"
            v-html="pageTitle"
            class="mb-4"
        />
        <posts-list
            :posts="data.posts"
        />
    </div>
</template>

<script>
import { SITE } from './../utils/constants';
import { currentPage, datalayerPage } from './../utils/mixins';
import PostsList from './../components/PostsList.vue';

export default {
    name: 'PageHome',

    components: {
        PostsList
    },

    mixins: [
        currentPage,
        datalayerPage
    ],

    watch: {
        '$route'() {
            this.fetchPage();
        }
    },

    serverPrefetch() {
        return this.fetchPage();
    },

    beforeMount() {
        this.fetchPage();
    },

    methods: {
        async fetchPage() {
            await this.$store.dispatch('data/fetchPageHome');

            this.afterDataLoaded();
        },
        afterDataLoaded() {
            if (typeof window === 'undefined') return;

            this.datalayerPageview(this.pageTitle);
        },
        showPageTitle() {
            return this.pageTitle !== SITE.TITLE;
        }
    }
};
</script>

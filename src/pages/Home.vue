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
        showPageTitle(title) {
            return title !== SITE.TITLE;
        }
    }
};
</script>

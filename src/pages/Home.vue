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

    computed: {
        pageTitleSearch() {
            const s = this.$route.query.s;
            return s && `Caută după "${s}"` || '';
        }
    },

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

            this.datalayerPageview();
        }
    }
};
</script>

export default {
    head() {
        return this.data.main.head;
    },

    computed: {
        data() {
            const pageKey = this.$route.fullPath;
            return this.$store.getters['data/currentPage'](pageKey);
        },
        pageTitle() {
            const pageKey = this.$route.fullPath;
            return this.$store.getters['data/currentPageTitle'](pageKey);
        }
    }
};

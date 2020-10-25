export default {
    computed: {
        data() {
            return this.$store.getters['data/currentPage']();
        },
        pageTitle() {
            return this.$store.getters['data/currentPageTitle']();
        }
    }
};

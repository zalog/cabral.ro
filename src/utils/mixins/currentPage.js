export default {
    computed: {
        data() {
            return this.$store.getters['data/currentPage']();
        },
        currentPageTitle() {
            return this.$store.getters['data/currentPageTitle']();
        }
    }
};

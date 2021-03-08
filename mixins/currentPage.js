export default {
    head() {
        return this.data.head;
    },

    computed: {
        data() {
            const pageKey = this.$route.fullPath;
            return this.$store.getters['data/currentPage'](pageKey);
        },
        pageTitle() {
            const pageKey = this.$route.fullPath;
            return this.$store.getters['data/currentPageTitle'](pageKey);
        },
    },

    mounted() {
        this.sendPageView({ title: this.pageTitle });
    },

    methods: {
        sendPageView({ title, url }) {
            this.$gtm.push({
                event: 'pageview',
                title,
                ...(url && { url }),
            });
        },
    },
};

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
        this.sendPageView();
    },

    methods: {
        sendPageView(payload) {
            payload = {
                title: this.pageTitle,
                ...payload,
            };

            this.$gtm.push({
                event: 'pageview',
                title: payload.title,
                ...(payload.url && { url: payload.url }),
            });
        },
    },
};

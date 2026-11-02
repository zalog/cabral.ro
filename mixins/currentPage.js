import { useHead, useRoute } from '#imports';

export default {
    computed: {
        data() {
            const pageKey = this.pageRoute.fullPath;
            return this.$store.getters['data/currentPage'](pageKey);
        },
        pageTitle() {
            const pageKey = this.pageRoute.fullPath;
            return this.$store.getters['data/currentPageTitle'](pageKey);
        },
    },

    created() {
        this.pageRoute = useRoute();

        useHead(() => ({
            ...this.data.head,
            ...this.head,
        }));
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

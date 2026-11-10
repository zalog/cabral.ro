import {
    computed,
    onMounted,
    toValue,
    useHead,
    useNuxtApp,
    useRoute,
} from '#imports';

const useCurrentPage = ({ head } = {}) => {
    const { $store: store, $gtm: gtm } = useNuxtApp();
    const route = useRoute();
    const data = computed(() => store.getters['data/currentPage'](route.fullPath));
    const pageTitle = computed(() => store.getters['data/currentPageTitle'](route.fullPath));

    const sendPageView = ({ title, url }) => {
        gtm.push({
            event: 'pageview',
            title,
            ...(url && { url }),
        });
    };

    useHead(() => ({
        ...data.value.head,
        ...toValue(head),
    }));

    onMounted(() => {
        sendPageView({ title: pageTitle.value });
    });

    return {
        data,
        sendPageView,
    };
};

export default useCurrentPage;

import { isValidPropData } from '~/utils/store';
import { fetchHead } from '../../services';

export default {
    namespaced: false,

    actions: {
        async fetchHead(
            { getters, commit },
            { route, url },
        ) {
            const pageKey = route.fullPath;
            const currentPage = getters.currentPage(pageKey);
            const prop = 'head';

            if (isValidPropData(currentPage, prop)) return;

            const response = await fetchHead({
                url,
            });

            commit('SET_PAGE_DATA', {
                prop,
                data: response,
                routePath: pageKey,
            });
        },
    },
};

import { fetchHead } from './../../services/head';
import { isValidPropData } from '~/utils/store';

export default {
    namespaced: false,

    actions: {
        fetchHead: async function({ getters, commit }, payload) {
            const pageKey = payload.route.fullPath;
            const currentPage = getters.currentPage(pageKey);
            const prop = 'head';

            if (isValidPropData(currentPage, prop)) return;

            const response = await fetchHead({
                $axios: this.$axios,
                url: payload.url,
            });

            commit('SET_PAGE_DATA', {
                prop,
                data: response,
                routePath: pageKey,
            });
        },
    },
};

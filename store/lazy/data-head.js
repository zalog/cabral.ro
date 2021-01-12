import { fetchHead } from './../../services/head';

export default {
    namespaced: false,

    actions: {
        fetchHead: async function({ commit }, payload) {
            const pageKey = payload.route.fullPath;

            const response = await fetchHead({
                $axios: this.$axios,
                url: payload.url
            });

            commit('SET_PAGE_DATA', {
                prop: 'head',
                data: response,
                routePath: pageKey
            });
        }
    }
};

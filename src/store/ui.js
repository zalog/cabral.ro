import { fetchMenu } from './../services/menu';

export default {
    namespaced: true,

    state: () => ({
        menu: [],
        toast: {}
    }),

    mutations: {
        MENU: (state, payload) => state.menu = payload,
        ADD_TOAST: (state, payload) => state.toast = payload
    },

    actions: {
        fetchMenu: ({ commit }) => {
            return fetchMenu().then((response) => {
                commit('MENU', response.data);
            });
        }
    }
};

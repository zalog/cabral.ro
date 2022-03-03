import { fetchCategories } from '../../services';

export default {
    namespaced: true,

    state: () => ([]),

    mutations: {
        SET: (state, payload) => {
            state.splice(0);
            state.push(...payload);
        },
    },

    actions: {
        async fetch({ commit }) {
            const response = await fetchCategories({
                $axios: this.$axios,
                params: {},
                adaptor: 'navCategories',
            });

            commit('SET', response);
        },
    },
};

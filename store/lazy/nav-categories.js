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
                params: {
                    orderby: 'count',
                    order: 'desc',
                    per_page: 10,
                },
                fields: ['name', 'slug', 'link', 'count'],
                adaptor: 'navCategories',
            });

            commit('SET', response);
        },
    },
};

import { fetchMenu } from './../../services/menu';

export default {
    namespaced: true,

    state: () => ([]),

    mutations: {
        SET: (state, payload) => {
            state.splice(0);
            payload.forEach((item) => state.push(item));
        },
    },

    actions: {
        fetch: async function({ commit }) {
            const response = await fetchMenu({
                $axios: this.$axios,
            });

            commit('SET', response);
        },
    },
};

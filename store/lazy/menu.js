import { fetchMenu } from '../../services';

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
        async fetch({ commit }) {
            const response = await fetchMenu({
                $axios: this.$axios,
            });

            commit('SET', response);
        },
    },
};

export default {
    namespaced: true,

    state: () => ([]),

    getters: {
        findIndex: (state) => (payload) => {
            return state.findIndex((item) => item.visible && item.message === payload.message);
        }
    },

    mutations: {
        PUSH: (state, payload) => {
            state.push(payload);
        }
    },

    actions: {
        push: ({commit, getters}, payload) => {
            const findIndex = getters['findIndex'](payload);

            if (findIndex > -1) return;

            commit('PUSH', payload);
        }
    }
};

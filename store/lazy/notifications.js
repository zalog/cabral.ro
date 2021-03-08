export default {
    namespaced: true,

    state: () => ([]),

    getters: {
        findIndex: (state) => (payload) => state.findIndex((item) => item.visible
            && item.message === payload.message),
    },

    mutations: {
        PUSH: (state, payload) => {
            state.push(payload);
        },
        DELETE: (state, payloadIndex) => {
            state.splice(payloadIndex, 1);
        },
    },

    actions: {
        push: ({ commit, getters }, payload) => {
            const findIndex = getters.findIndex(payload);

            if (findIndex > -1) return;

            const output = { ...payload };

            if (typeof payload.visible === 'undefined') output.visible = true;

            commit('PUSH', output);
        },
        delete: ({ state, commit }, payloadIndex) => {
            if (!state[payloadIndex]) return;

            commit('DELETE', payloadIndex);
        },
    },
};

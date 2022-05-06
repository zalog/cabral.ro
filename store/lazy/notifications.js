export default {
    namespaced: true,

    state: () => ([]),

    getters: {
        findIndex: (state) => (id) => state.findIndex((item) => item.id === id),
    },

    mutations: {
        PUSH: (state, payload) => {
            state.push(payload);
        },
        DELETE: (state, index) => {
            state.splice(index, 1);
        },
    },

    actions: {
        push: ({ commit, getters }, payload) => {
            const findIndex = getters.findIndex(payload);

            if (findIndex > -1) return;

            const output = { ...payload };

            if (typeof payload.visible === 'undefined') output.visible = true;
            if (!output.id) output.id = new Date().getTime();

            commit('PUSH', output);
        },
        delete: ({ commit, getters }, id) => {
            const index = getters.findIndex(id);

            if (index === -1) return;

            commit('DELETE', index);
        },
    },
};

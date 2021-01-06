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
        },
        DELETE: (state, payloadIndex) => {
            state.splice(payloadIndex, 1);
        }
    },

    actions: {
        push: ({commit, getters}, payload) => {
            const findIndex = getters['findIndex'](payload);

            if (findIndex > -1) return;

            if (typeof payload.visible === 'undefined') payload.visible = true;

            commit('PUSH', payload);
        },
        delete: ({state, commit}, payloadIndex) => {
            if (!state[payloadIndex]) return;

            commit('DELETE', payloadIndex);
        }
    }
};

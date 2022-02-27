export default {
    state: () => ({}),

    mutations: {
        SET: (state, { key, value }) => {
            Object.assign(state, {
                [key]: value,
            });
        },
    },

    actions: {
        attachResizeObserve({ commit }, { el }) {
            const ro = new ResizeObserver((entries) => entries.forEach((entry) => {
                commit('SET', { key: 'width', value: entry.contentRect.width });
            }));

            ro.observe(el);
        },
    },
};

export default {
  namespaced: true,

  state: () => ({
    count: 0
  }),

  mutations: {
    inc: state => state.count++
  },

  actions: {
    inc: ({ commit }) => commit('inc')
  }
};
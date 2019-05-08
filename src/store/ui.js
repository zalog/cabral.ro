import { fetchMenu } from './../services/menu';

export default {
  namespaced: true,

  state: () => ({
    menu: []
  }),

  mutations: {
    menu: (state, payload) => state.menu = payload
  },

  actions: {
    fetchMenu: ({ commit }) => {
      return fetchMenu().then((response) => {
        commit('menu', response.data);
      });
    }
  }
};
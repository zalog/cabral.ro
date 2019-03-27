import { fetchMenu } from './../services/menu';

export default {
  namespaced: true,

  state: () => ({
    menu: []
  }),

  mutations: {
    menu: (state, playload) => state.menu = playload
  },

  actions: {
    fetchMenu: ({ commit }) => {
      return fetchMenu().then((response) => {
        commit('menu', response.data);
      });
    }
  }
};
import { fetchMenu } from './../services/menu';

export default {
  namespaced: true,

  state: () => ({
    menu: [],
    toast: {}
  }),

  mutations: {
    menu: (state, payload) => state.menu = payload,
    addToast: (state, payload) => state.toast = payload
  },

  actions: {
    fetchMenu: ({ commit }) => {
      return fetchMenu().then((response) => {
        commit('menu', response.data);
      });
    }
  }
};
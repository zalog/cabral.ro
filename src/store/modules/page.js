import { fetchPage } from './../../services/page';

export default {
  namespaced: true,

  state: () => ({
    page: false
  }),

  mutations: {
    page: (state, playload) => state.page = playload
  },

  actions: {
    fetch: ({ commit }, pageSlug) => {
      return fetchPage({slug: pageSlug}).then((response) => {
        commit('page', response.data[0]);
      });
    }
  }
};
import { fetchPost, fetchPage } from './../../services/single';

export default {
  namespaced: true,

  state: () => ({
    post: false,
    page: false
  }),

  mutations: {
    post: (state, playload) => state.post = playload,
    page: (state, playload) => state.page = playload
  },

  actions: {
    fetchPost: ({ commit }, singleSlug) => {
      return fetchPost({slug: singleSlug}).then((response) => {
        commit('post', response.data[0]);
      });
    },
    fetchPage: ({ commit }, singleSlug) => {
      return fetchPage({slug: singleSlug}).then((response) => {
        commit('page', response.data[0]);
      });
    },
    fetch: ({ commit }, singleSlug) => {
      return fetchPost({slug: singleSlug}).then((response) => {
        if (response.data.length)
          commit('post', response.data[0]);
        else
          return fetchPage({slug: singleSlug}).then((response) => {
            commit('page', response.data[0]);
          });
      });
    }
  }
};
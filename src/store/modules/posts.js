import { fetchPosts } from './../../services/posts';
import paginate from 'jw-paginate';

export default {
  namespaced: true,

  state: () => ({
    posts: [],
    pagination: []
  }),

  mutations: {
    posts: (state, playload) => state.posts = playload,
    pagination: (state, payload) => state.pagination = payload
  },

  actions: {
    fetch: ({ dispatch, commit }, payload) => {
      payload = {
        fields: ['title'],
        itemsOnPage: 12,
        ...payload
      };

      if (typeof payload.currentPage === 'string') payload.currentPage = parseInt(payload.currentPage);

      return fetchPosts(payload).then((response) => {
        const itemsTotal = parseInt(response.headers['x-wp-total']);

        commit('posts', response.data);
        dispatch('pagination', {itemsTotal, currentPage: payload.currentPage, itemsOnPage: payload.itemsOnPage});
      });
    },
    pagination: ({ commit }, payload) => {
      const maxPages = 10;
      const pages = paginate(payload.itemsTotal, payload.currentPage, payload.itemsOnPage, maxPages).pages;

      commit('pagination', pages);
    }
  }
};
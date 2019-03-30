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
    fetch: ({ commit }, payload) => {
      payload = {
        fields: ['title'],
        ...payload
      };

      if (typeof payload.currentPage === 'string') payload.currentPage = parseInt(payload.currentPage);

      return fetchPosts(payload).then((response) => {
        let itemsTotal = parseInt(response.headers['x-wp-total']);
        let paginationItemsOnPage = 10;
        let paginationMaxPages = 11;

        let pagination = paginate(itemsTotal, payload.currentPage, paginationItemsOnPage, paginationMaxPages);

        commit('pagination', pagination.pages);
        commit('posts', response.data);
      });
    }
  }
};
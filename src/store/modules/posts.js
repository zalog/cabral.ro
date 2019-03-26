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
    fetch: ({ commit }, currentPage) => {
      return fetchPosts({currentPage: currentPage}).then((response) => {
        let itemsTotal = parseInt(response.headers['x-wp-total']);
        let paginationItemsOnPage = 10;
        let paginationMaxPages = 11;

        if (typeof currentPage === 'string') currentPage = parseInt(currentPage);

        let pagination = paginate(itemsTotal, currentPage, paginationItemsOnPage, paginationMaxPages);

        commit('pagination', pagination.pages);
        commit('posts', response.data);
      });
    }
  }
};
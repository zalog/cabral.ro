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
    fetch: ({ commit }, payloadParams) => {
      payloadParams.fields = ['title'];

      if (typeof payloadParams.currentPage === 'string') payloadParams.currentPage = parseInt(payloadParams.currentPage);

      return fetchPosts(payloadParams).then((response) => {
        let itemsTotal = parseInt(response.headers['x-wp-total']);
        let paginationItemsOnPage = 10;
        let paginationMaxPages = 11;

        let pagination = paginate(itemsTotal, payloadParams.currentPage, paginationItemsOnPage, paginationMaxPages);

        commit('pagination', pagination.pages);
        commit('posts', response.data);
      });
    }
  }
};
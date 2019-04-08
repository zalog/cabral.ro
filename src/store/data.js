import { fetchPosts } from './../services/posts';
import paginate from 'jw-paginate';

export default {
  namespaced: true,

  state: () => ({}),

  mutations: {
    addPosts: (state, payload) => {
      state[payload.path] = {
        ...state[payload.path],
        posts: payload.data
      };
    },
    addPostsPagination: (state, payload) => {
      state[payload.path] = {
        ...state[payload.path],
        postsPagination: {
          data: payload.data,
          currentPage: payload.currentPage
        }
      };
    }
  },

  actions: {
    fetchPosts: ({ state, commit }, payload) => {
      payload = {
        fields: ['title'],
        itemsOnPage: 12,
        ...payload
      };

      // stops if page exists
      if (state.hasOwnProperty(payload.path)) return;

      return fetchPosts(payload).then((response) => {
        payload.currentPage = parseInt(payload.currentPage);

        const maxPages = 10;
        const itemsTotal = parseInt(response.headers['x-wp-total']);
        const pagination = paginate(itemsTotal, payload.currentPage, payload.itemsOnPage, maxPages);

        commit('addPosts', {
          path: payload.path,
          page: payload.currentPage,
          data: response.data
        });
        commit('addPostsPagination', {
          path: payload.path,
          data: pagination.pages,
          currentPage: pagination.currentPage
        });
      });

    }
  }
};
import { fetchPosts } from './../services/posts';
import paginate from 'jw-paginate';

export default {
  namespaced: true,

  state: () => ([]),

  mutations: {
    addPosts: (state, payload) => {
      state.push({
        [payload.path]: {
          posts: payload.data
        }
      });

      if (state.length >= 5) state.shift();
    },
    addPostsPagination: (state, payload) => {
      let page = state.find(obj => obj[payload.path]);
      page[payload.path].postsPagination = {
        data: payload.data,
        currentPage: payload.currentPage
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
      let page = state.find(obj => obj[payload.path]);
      if (typeof page !== 'undefined') return;

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
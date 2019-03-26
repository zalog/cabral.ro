import Vue from 'vue';
import { API } from './../../utils/constants';
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
      return new Promise((resolve, reject) => {
        if (typeof currentPage === 'string') currentPage = parseInt(currentPage);

        let itemsOnPage = 10;
        let paginationMaxPages = 11;

        Vue.prototype.$http({
          method: 'get',
          url: API.POSTS,
          params: {
            'per_page': itemsOnPage,
            'page': currentPage
          }
        }).then((response) => {
          let itemsTotal = parseInt(response.headers['x-wp-total']);
          let pagination = paginate(itemsTotal, currentPage, itemsOnPage, paginationMaxPages);

          commit('pagination', pagination.pages);
          commit('posts', response.data);
          resolve();
        }).catch((error) => {
          reject(error);
        });
      });
    }
  }
};
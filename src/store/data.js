import { fetchPosts } from './../services/posts';
import { fetchPost, fetchPage } from './../services/single';
import paginate from 'jw-paginate';

const pagesToKeep = 5;

export default {
  namespaced: true,

  state: () => ([]),

  mutations: {
    addPosts: (state, payload) => {
      state.push({
        [payload.path]: {
          posts: {
            data: payload.data
          }
        }
      });

      if (state.length > pagesToKeep) state.shift();
    },
    addPostsPagination: (state, payload) => {
      let page = state.find(obj => obj[payload.path]);
      page[payload.path].posts.pagination = {
        data: payload.data,
        currentPage: payload.currentPage
      };
    },
    addSingle: (state, payload) => {
      state.push({
        [payload.slug]: {
          data: payload.data
        }
      });

      if (state.length > pagesToKeep) state.shift();
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
    },
    fetchPost: ({ commit }, {slug}) => {
      return fetchPost({slug}).then((response) => {
        commit('addSingle', {
          slug,
          data: response.data[0]
        });
      });
    },
    fetchPage: ({ commit }, {slug}) => {
      return fetchPage({slug}).then((response) => {
        commit('addSingle', {
          slug,
          data: response.data[0]
        });
      });
    },
    fetchSingle: ({ state, commit }, {slug}) => {
      // stops if slug exists
      let page = state.find(obj => obj[slug]);
      if (typeof page !== 'undefined') return;

      return fetchPost({slug}).then((response) => {
        if (response.data.length)
          commit('addSingle', {
            slug,
            data: response.data[0]
          });
        else
          return fetchPage({slug}).then((response) => {
            commit('addSingle', {
              slug,
              data: response.data[0]
            });
          });
      });
    }
  }
};
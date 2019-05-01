import Vue from 'vue';

import paginate from 'jw-paginate';

import { fetchPosts } from './../services/posts';
import { fetchPost, fetchPage } from './../services/single';
import { fetchComments } from '../services/comments';

const pagesToKeep = 5;
const pageInData = (state, slug) => {
  let page = state.find(obj => obj[slug]);
  if (typeof page !== 'undefined') return true;
};
const commentsOnPage = 10;

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
    },
    addComments: (state, payload) => {
      let page = state.find(obj => obj[payload.slug])[payload.slug];
      if (!page.hasOwnProperty('comments') || !page.comments.length) Vue.set(page, 'comments', []);

      page.comments.push(...payload.data);
    }
  },

  actions: {
    fetchPosts: ({ state, commit }, payload) => {
      payload = {
        fields: ['title', 'slug', 'excerpt', 'featured_media_src'],
        itemsOnPage: 12,
        ...payload
      };

      if (pageInData(state, payload.path)) return;

      return fetchPosts(payload).then((response) => {
        payload.currentPage = parseInt(payload.currentPage);

        const maxPages = 8;
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
    fetchPost: ({ state, commit }, payload) => {
      if (pageInData(state, payload.slug)) return;

      return fetchPost(payload).then((response) => {
        commit('addSingle', {
          slug: payload.slug,
          data: response.data[0],
          ...payload
        });
      });
    },
    fetchPage: ({ state, commit }, payload) => {
      if (pageInData(state, payload.slug)) return;

      return fetchPage(payload).then((response) => {
        commit('addSingle', {
          slug: payload.slug,
          data: response.data[0],
          ...payload
        });
      });
    },
    fetchSingle: ({ state, commit }, {slug}) => {
      if (pageInData(state, slug)) return;

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
    },
    fetchComments: ({ state, commit }, { slug }) => {
      let page = state.find(obj => obj[slug])[slug];
      let nextCommentsPage = page.hasOwnProperty('comments') && (page.comments.length / commentsOnPage + 1) || 1;

      return fetchComments({
        post: page.data.id,
        page: nextCommentsPage,
        per_page: commentsOnPage
      }).then((response) => {
        commit('addComments', {
          slug,
          data: response
        });
      });
    }
  }
};
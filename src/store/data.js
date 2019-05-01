import paginate from 'jw-paginate';

import { fetchPosts } from './../services/posts';
import { fetchPost, fetchPage } from './../services/single';
import { fetchComments } from '../services/comments';

const pagesToKeep = 5;
const pageInData = (state, slug) => {
  let pageData = state.find(obj => obj[slug]);
  if (typeof pageData !== 'undefined') return true;
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
      let pageData = state.find(obj => obj[payload.path]);
      pageData[payload.path].posts.pagination = {
        data: payload.data,
        currentPage: payload.currentPage
      };
    },
    addSingle: (state, payload) => {
      state.push({
        [payload.slug]: {
          single: payload.single,
          comments: {
            data: [],
            loading: false
          }
        }
      });

      if (state.length > pagesToKeep) state.shift();
    },
    addComments: (state, payload) => {
      let pageData = state.find(obj => obj[payload.slug])[payload.slug];

      pageData.comments.data.push(...payload.data);
      pageData.comments.loading = false;
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
          single: response.data[0],
          ...payload
        });
      });
    },
    fetchPage: ({ state, commit }, payload) => {
      if (pageInData(state, payload.slug)) return;

      return fetchPage(payload).then((response) => {
        commit('addSingle', {
          slug: payload.slug,
          single: response.data[0],
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
            single: response.data[0]
          });
        else
          return fetchPage({slug}).then((response) => {
            commit('addSingle', {
              slug,
              single: response.data[0]
            });
          });
      });
    },
    fetchComments: ({ state, commit }, { slug }) => {
      let pageData = state.find(obj => obj[slug])[slug];
      let nextCommentsPage = (pageData.comments.data.length / commentsOnPage + 1) || 1;
      nextCommentsPage = Math.ceil(nextCommentsPage);

      pageData.comments.loading = true;

      return fetchComments({
        post: pageData.single.id,
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
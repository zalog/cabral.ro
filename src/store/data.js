import paginate from 'jw-paginate';

import { fetchPosts } from './../services/posts';
import { fetchPost, fetchPage } from './../services/single';
import { fetchComments, postComment } from '../services/comments';

const pagesToKeep = 5;
const postsOnPage = 12;
const commentsOnPage = 10;

export default {
  namespaced: true,

  state: () => ([]),

  getters: {
    currentPage: (state, getters, rootState) => {
      const pages = state;
      const path = rootState.route.path;
      const page = pages.find(page => page[path]);
      let output = typeof page !== 'undefined' && page[path] || false;

      return output;
    }
  },

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
      pageData.comments.pageInfo = payload.pageInfo;
    },
    addComment: (state, payload) => {
      let pageData = state.find(obj => obj[payload.slug])[payload.slug];
      let pageComments = pageData.comments.data;
      let comment = {
        commentId: payload.comment.id,
        author: {
          name: payload.comment.author_name,
          url: payload.comment.author_url
        },
        content: payload.comment.content.rendered,
        date: payload.comment.date
      };

      if (typeof payload.index === 'undefined') {
        comment.replies = {
          nodes: []
        };
      } else {
        pageComments = pageData.comments.data[payload.index].replies.nodes;
      }

      pageComments.unshift(comment);
    }
  },

  actions: {
    fetchPosts: ({ getters, commit, rootState }, payload) => {
      payload = {
        fields: ['title', 'slug', 'excerpt', 'featured_media'],
        itemsOnPage: postsOnPage,
        pageLoading: true,
        ...payload
      };

      if (getters.currentPage) return;

      return fetchPosts(payload).then((response) => {
        payload.currentPage = parseInt(payload.currentPage);

        const maxPages = 8;
        const itemsTotal = parseInt(response.headers['x-wp-total']);
        const pagination = paginate(itemsTotal, payload.currentPage, payload.itemsOnPage, maxPages);

        commit('addPosts', {
          path: rootState.route.path,
          page: payload.currentPage,
          data: response.data
        });
        commit('addPostsPagination', {
          path: rootState.route.path,
          data: pagination.pages,
          currentPage: pagination.currentPage
        });
      });
    },
    fetchPost: ({ getters, commit, rootState }) => {
      if (getters.currentPage) return;

      return fetchPost({
        slug:rootState.route.path,
        pageLoading: true
      }).then((response) => {
        commit('addSingle', {
          slug: rootState.route.path,
          single: response.data[0]
        });
      });
    },
    fetchPage: ({ getters, commit, rootState }) => {
      if (getters.currentPage) return;

      return fetchPage({
        slug:rootState.route.path,
        pageLoading: true
      }).then((response) => {
        commit('addSingle', {
          slug: rootState.route.path,
          single: response.data[0]
        });
      });
    },
    fetchSingle: ({ getters, commit, rootState }) => {
      if (getters.currentPage) return;

      return fetchPost({
        slug: rootState.route.path,
        pageLoading: true
      }).then((response) => {
        if (response.data.length)
          commit('addSingle', {
            slug: rootState.route.path,
            single: response.data[0]
          });
        else
          return fetchPage({
            slug: rootState.route.path,
            pageLoading: true
          }).then((response) => {
            commit('addSingle', {
              slug: rootState.route.path,
              single: response.data[0]
            });
          });
      });
    },
    fetchComments: ({ getters, commit, rootState }) => {
      let page = getters.currentPage;
      let pageComments = page.comments;
      let commentsFrom = null;

      if (pageComments.pageInfo) {
        if (pageComments.pageInfo.hasNextPage) commentsFrom = pageComments.pageInfo.endCursor;
        else return;
      }

      pageComments.loading = true;

      return fetchComments({
        singleId: page.single.id,
        onPage: commentsOnPage,
        after: commentsFrom
      }).then((response) => {
        commit('addComments', {
          slug: rootState.route.path,
          data: response.nodes,
          pageInfo: response.pageInfo
        });
      });
    },
    postComment: ({ commit, rootState }, payload) => {
      return new Promise((resolve, reject) => {
        postComment(payload).then((comment) => {
          let toastMessage = `${comment.author_name}, comentariul tău a fost salvat!`;
          let toastVariant = 'success';
          (comment.status === 'hold') && (toastMessage = `${comment.author_name}, comentariul tău urmează să fie aprobat.`);
          if (comment.status === 'spam') {
            toastMessage = `Comentariul tău a fost marcat ca spam.`;
            toastVariant = 'danger';
          }

          if (comment.status === 'approved') {
            commit('addComment', {
              slug: rootState.route.path,
              index: payload.index,
              comment
            });
          }

          commit('ui/addToast', {
            message: toastMessage,
            variant: toastVariant
          }, { root: true });

          resolve(comment.id);
        }).catch((response) => {
          commit('ui/addToast', {
            message: response.data.message,
            variant: 'danger'
          }, { root: true });

          reject();
        });
      });
    }
  }
};
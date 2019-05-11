import paginate from 'jw-paginate';

import { fetchPosts } from './../services/posts';
import { fetchPost, fetchPage } from './../services/single';
import { fetchComments, postComment } from '../services/comments';

const pagesToKeep = 5;
const pageInData = (state, slug) => {
  let pageData = state.find(obj => obj[slug]);
  if (typeof pageData !== 'undefined') return true;
};
const postsOnPage = 12;
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
    fetchPosts: ({ state, commit }, payload) => {
      payload = {
        fields: ['title', 'slug', 'excerpt', 'featured_media_src'],
        itemsOnPage: postsOnPage,
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
      let pageComments = pageData.comments;
      let commentsFrom = null;

      if (pageComments.pageInfo) {
        if (pageComments.pageInfo.hasNextPage) commentsFrom = pageComments.pageInfo.endCursor;
        else return;
      }

      pageComments.loading = true;

      return fetchComments({
        singleId: pageData.single.id,
        onPage: commentsOnPage,
        after: commentsFrom
      }).then((response) => {
        commit('addComments', {
          slug,
          data: response.nodes,
          pageInfo: response.pageInfo
        });
      });
    },
    postComment: ({ commit }, payload) => {
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
              slug: payload.slug,
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
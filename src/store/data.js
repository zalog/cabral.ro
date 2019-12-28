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
            const path = rootState.route.fullPath;
            const page = pages.find(page => page[path]);
            let output = typeof page !== 'undefined' && page[path] || false;

            return output;
        }
    },

    mutations: {
        ADD_POSTS: (state, payload) => {
            state.push({
                [payload.fullPath]: {
                    posts: {
                        data: payload.data
                    }
                }
            });

            if (state.length > pagesToKeep) state.shift();
        },
        ADD_POSTS_PAGINATION: (state, payload) => {
            let pageData = state.find(obj => obj[payload.fullPath]);
            pageData[payload.fullPath].posts.pagination = {
                data: payload.data,
                currentPage: payload.currentPage
            };
        },
        ADD_SINGLE: (state, payload) => {
            state.push({
                [payload.fullPath]: {
                    single: payload.single,
                    comments: {
                        data: [],
                        loading: false
                    }
                }
            });

            if (state.length > pagesToKeep) state.shift();
        },
        ADD_COMMENTS: (state, payload) => {
            let pageData = state.find(obj => obj[payload.fullPath])[payload.fullPath];

            pageData.comments.data.push(...payload.data);
            pageData.comments.loading = false;
            pageData.comments.pageInfo = payload.pageInfo;
        },
        ADD_COMMENT: (state, payload) => {
            let pageData = state.find(obj => obj[payload.fullPath])[payload.fullPath];
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
        fetchPosts: async ({ getters, commit, rootState }, payload) => {
            payload = {
                fields: ['title', 'slug', 'excerpt', 'embed_featured_media', 'comments_number', 'embed', 'date', 'modified'],
                itemsOnPage: postsOnPage,
                currentPage: parseInt(rootState.route.params.id) || 1,
                pageLoading: true,
                search: rootState.route.query.s,
                ...payload
            };

            if (getters.currentPage) return;

            const response = await fetchPosts(payload);

            const maxPages = 8;
            const itemsTotal = parseInt(response.headers['x-wp-total']);
            const pagination = paginate(itemsTotal, payload.currentPage, payload.itemsOnPage, maxPages);

            commit('ADD_POSTS', {
                fullPath: rootState.route.fullPath,
                data: response.data
            });
            commit('ADD_POSTS_PAGINATION', {
                fullPath: rootState.route.fullPath,
                data: pagination.pages,
                currentPage: pagination.currentPage
            });
        },
        fetchPost: async ({ getters, commit, rootState }) => {
            if (getters.currentPage) return;

            const response = await fetchPost({
                fields: [
                    'id', 'title', 'date', 'modified', 'content',
                    'embed', 'embed_featured_media', 'comments_number'
                ],
                slug: rootState.route.path,
                pageLoading: true
            });

            if (!response) return;

            commit('ADD_SINGLE', {
                fullPath: rootState.route.fullPath,
                single: response
            });

            return true;
        },
        fetchPage: async ({ getters, commit, rootState }) => {
            if (getters.currentPage) return;

            const response = await fetchPage({
                fields: [
                    'id', 'title', 'date', 'modified', 'content',
                    'comments_number'
                ],
                slug: rootState.route.path,
                pageLoading: true
            });

            if (!response) return;

            commit('ADD_SINGLE', {
                fullPath: rootState.route.fullPath,
                single: response
            });

            return true;
        },
        fetchSingle: async ({ dispatch, getters, commit, rootState }) => {
            if (getters.currentPage) return;

            let response = await dispatch('fetchPost');
            !response && (response = await dispatch('fetchPage'));
        },
        fetchComments: async ({ getters, commit, rootState }) => {
            const page = getters.currentPage;
            const pageComments = page.comments;
            const pageSingleId = page.single.id;
            let commentsFrom = null;

            if (!page || !pageSingleId) throw Error('`fetchComments` needs `page` or `pageSingleId`.');

            if (pageComments.pageInfo) {
                if (pageComments.pageInfo.hasNextPage) commentsFrom = pageComments.pageInfo.endCursor;
                else return;
            }

            pageComments.loading = true;

            const response = await fetchComments({
                singleId: pageSingleId,
                onPage: commentsOnPage,
                after: commentsFrom
            });

            commit('ADD_COMMENTS', {
                fullPath: rootState.route.fullPath,
                data: response.nodes,
                pageInfo: response.pageInfo
            });
        },
        postComment: async ({ commit, rootState }, payload) => {
            try {
                const comment = await postComment(payload);

                let toastMessage = `${comment.author_name}, comentariul tău a fost salvat!`;
                let toastVariant = 'success';
                (comment.status === 'hold') && (toastMessage = `${comment.author_name}, comentariul tău urmează să fie aprobat.`);
                if (comment.status === 'spam') {
                    toastMessage = 'Comentariul tău a fost marcat ca spam.';
                    toastVariant = 'danger';
                }

                if (comment.status === 'approved') {
                    commit('ADD_COMMENT', {
                        fullPath: rootState.route.fullPath,
                        index: payload.index,
                        comment
                    });
                }

                commit('ui/ADD_TOAST', {
                    message: toastMessage,
                    variant: toastVariant
                }, { root: true });

                return comment.id;
            } catch (error) {
                commit('ui/ADD_TOAST', {
                    message: error.data.message,
                    variant: 'danger'
                }, { root: true });
            }
        }
    }
};

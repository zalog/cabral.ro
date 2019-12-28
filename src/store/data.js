import paginate from 'jw-paginate';

import { fetchPosts } from './../services/posts';
import { fetchPost, fetchPage } from './../services/single';
import { fetchComments, postComment } from '../services/comments';

const pagesToKeep = 5;
const postsOnPage = 12;
const paginationMaxPages = 8;
const commentsOnPage = 10;

export default {
    namespaced: true,

    state: () => ([]),

    getters: {
        currentPage: (state, getters, rootState) => (path) => {
            path = path || rootState.route.fullPath;

            const pages = state;
            const page = pages.find(page => page[path]);
            const output = typeof page !== 'undefined' && page[path] || false;

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
            const currentPage = payload.getters.currentPage(payload.fullPath);

            currentPage.posts.pagination = {
                data: payload.pagination.data,
                currentPage: payload.pagination.currentPage
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
        ADD_METAS: (state, payload) => {
            const currentPage = payload.getters.currentPage(payload.fullPath);
            const data = payload.data;

            currentPage.meta = data;
        },
        ADD_COMMENTS: (state, payload) => {
            const currentPage = payload.getters.currentPage(payload.fullPath);

            currentPage.comments.data.push(...payload.data);
            currentPage.comments.loading = false;
            currentPage.comments.pageInfo = payload.pageInfo;
        },
        ADD_COMMENT: (state, payload) => {
            const currentPage = payload.getters.currentPage(payload.fullPath);
            let pageComments = currentPage.comments.data;

            const comment = {
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
                pageComments = currentPage.comments.data[payload.index].replies.nodes;
            }

            pageComments.unshift(comment);
        }
    },

    actions: {
        fetchPosts: async ({ getters, commit, rootState }, payload) => {
            payload = {
                fields: ['title', 'slug', 'excerpt', 'embed_featured_media', 'comments_number', 'embed', 'date', 'modified'],
                pagination: {
                    itemsOnPage: postsOnPage,
                    currentPage: parseInt(rootState.route.params.id) || 1
                },
                pageLoading: true,
                search: rootState.route.query.s,
                ...payload
            };

            if (getters.currentPage()) return;

            const response = await fetchPosts(payload);

            const paginationItemsTotal = parseInt(response.headers['x-wp-total']);
            const pagination = paginate(paginationItemsTotal, payload.pagination.currentPage, payload.pagination.itemsOnPage, paginationMaxPages);

            commit('ADD_POSTS', {
                fullPath: rootState.route.fullPath,
                data: response.data
            });
            commit('ADD_POSTS_PAGINATION', {
                fullPath: rootState.route.fullPath,
                pagination: {
                    data: pagination.pages,
                    currentPage: pagination.currentPage
                },
                getters
            });
        },
        fetchPost: async ({ getters, commit, rootState }) => {
            if (getters.currentPage()) return;

            const response = await fetchPost({
                fields: [
                    'id', 'title', 'date', 'modified', 'content',
                    'embed', 'embed_featured_media', 'comments_number', 'yoast_meta'
                ],
                embed_featured_media_size: 'full',
                slug: rootState.route.path,
                pageLoading: true
            });

            if (!response) return;

            commit('ADD_SINGLE', {
                fullPath: rootState.route.fullPath,
                single: response.single
            });

            commit('ADD_METAS', {
                fullPath: rootState.route.fullPath,
                data: response.meta,
                getters
            });

            return true;
        },
        fetchPage: async ({ getters, commit, rootState }) => {
            if (getters.currentPage()) return;

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
        fetchSingle: async ({ dispatch, getters }) => {
            if (getters.currentPage()) return;

            let response = await dispatch('fetchPost');
            !response && (response = await dispatch('fetchPage'));
        },
        fetchComments: async ({ getters, commit, rootState }) => {
            const page = getters.currentPage();
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

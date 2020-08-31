import Vue from 'vue';
import paginate from 'jw-paginate';

import { fetchPosts } from './../services/posts';
import { fetchPost, fetchPage } from './../services/single';
import { fetchComments, postComment } from '../services/comments';
import { fetchCategory } from '../services/category';

const pagesToKeep = 5;
const postsOnPage = 12;
const paginationMaxPages = 8;
const commentsOnPage = 10;

export default {
    namespaced: true,

    state: () => ([]),

    getters: {
        currentPage: (state, getters, rootState) => (path, passedState) => {
            path = path || rootState.route.fullPath;
            state = passedState || state;

            const pages = state;
            const page = pages.find(page => page[path]);
            const output = typeof page !== 'undefined' && page[path] || false;

            return output;
        }
    },

    mutations: {
        ADD_PAGE: (state, payload) => {
            state.push({[payload.fullPath]: {}});
        },
        ADD_POSTS: (state, payload) => {
            const currentPage = payload.getters.currentPage(payload.fullPath);

            Vue.set(currentPage, 'posts', {
                data: payload.data
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
        ADD_CATEGORY: (state, payload) => {
            const currentPage = payload.getters.currentPage(payload.fullPath);

            Vue.set(currentPage, 'category', {
                ...payload.data
            });
        },
        ADD_SINGLE: (state, payload) => {
            const currentPage = payload.getters.currentPage(payload.fullPath);

            Vue.set(currentPage, 'single', {
                ...payload.single
            });

            if (state.length > pagesToKeep) state.shift();
        },
        ADD_HEAD_TAGS: (state, payload) => {
            const currentPage = payload.getters.currentPage(payload.fullPath);
            const data = payload.data;

            currentPage.head = {...data};
        },
        ADD_RELATED: (state, payload) => {
            const currentPage = payload.getters.currentPage(payload.fullPath);
            const data = payload.data;

            currentPage.related = data;
        },
        INIT_SINGLE_COMMENTS: (state, payload) => {
            const currentPage = payload.getters.currentPage(payload.fullPath);

            Vue.set(currentPage, 'comments', {
                data: [],
                loading: null,
                pageInfo: {}
            });
        },
        SET_SINGLE_COMMENTS_PROPS: (state, payload) => {
            const currentPage = payload.getters.currentPage(payload.fullPath);

            Object.keys(payload.data).forEach((key) => {
                const value = payload.data[key];
                currentPage.comments[key] = value;
            });
        },
        PUSH_SINGLE_COMMENTS: (state, payload) => {
            const currentPage = payload.getters.currentPage(payload.fullPath);

            currentPage.comments.data.push(...payload.data);
        },
        ADD_SINGLE_COMMENT: (state, payload) => {
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
        fetchPageHome: async({ getters, commit, rootState, dispatch }) => {
            const currentPage = getters.currentPage();

            if (!currentPage) commit('ADD_PAGE', {fullPath: rootState.route.fullPath});

            if (currentPage.posts) return;

            await dispatch('fetchPosts', {
                pageLoading: true
            });
        },
        fetchPageCategory: async({ getters, commit, rootState, dispatch }, payload) => {
            const currentPage = getters.currentPage();

            if (!currentPage) commit('ADD_PAGE', {fullPath: rootState.route.fullPath});

            if (currentPage.posts) return;

            await dispatch('fetchPosts', {
                categories: [payload.slug],
                pageLoading: true
            });

            await dispatch('fetchCategory', {
                params: {
                    slug: payload.slug
                }
            });
        },
        fetchPagePost: async({ getters, commit, rootState, dispatch }) => {
            const currentPage = getters.currentPage();

            if (!currentPage) commit('ADD_PAGE', {fullPath: rootState.route.fullPath});

            if (currentPage.single) return;

            await dispatch('fetchPost', {
                pageLoading: true
            });
        },
        fetchPagePage: async({ getters, commit, rootState, dispatch }) => {
            const currentPage = getters.currentPage();

            if (!currentPage) commit('ADD_PAGE', {fullPath: rootState.route.fullPath});

            if (currentPage.single) return;

            await dispatch('fetchPage', {
                pageLoading: true
            });
        },
        fetchPageSingle: async ({ dispatch, getters, commit, rootState }) => {
            const currentPage = getters.currentPage();

            if (!currentPage) commit('ADD_PAGE', {fullPath: rootState.route.fullPath});

            if (currentPage.single) return;

            let response = await dispatch('fetchPost');
            !response && (response = await dispatch('fetchPage'));
        },
        fetchPosts: async ({ getters, commit, rootState }, payload) => {
            payload = {
                fields: [
                    'title', 'slug', 'excerpt', 'date', 'modified',
                    'embed', 'embed_featured_media', 'comments_number'
                ],
                pagination: {
                    itemsOnPage: postsOnPage,
                    currentPage: parseInt(rootState.route.params.id) || 1
                },
                search: rootState.route.query.s,
                ...payload
            };

            const response = await fetchPosts(payload);

            const paginationItemsTotal = parseInt(response.headers['x-wp-total']);
            const pagination = paginate(paginationItemsTotal, payload.pagination.currentPage, payload.pagination.itemsOnPage, paginationMaxPages);

            commit('ADD_POSTS', {
                fullPath: rootState.route.fullPath,
                data: response.data,
                getters
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
        fetchCategory: async ({ getters, commit, rootState }, payload) => {
            const response = await fetchCategory(payload);

            commit('ADD_CATEGORY', {
                fullPath: rootState.route.fullPath,
                data: response,
                getters
            });
        },
        fetchPost: async ({ getters, commit, rootState }, payload) => {
            const response = await fetchPost({
                fields: [
                    'id', 'link', 'title', 'date', 'modified', 'content',
                    'embed', 'embed_featured_media', 'comments_number', 'yoast_meta', 'jetpack-related-posts'
                ],
                embed_featured_media_size: 'full',
                slug: rootState.route.path,
                ...payload
            });

            if (!response) return;

            commit('ADD_SINGLE', {
                fullPath: rootState.route.fullPath,
                single: response.single,
                getters
            });

            commit('ADD_HEAD_TAGS', {
                fullPath: rootState.route.fullPath,
                data: response.head,
                getters
            });

            commit('ADD_RELATED', {
                fullPath: rootState.route.fullPath,
                data: response.related,
                getters
            });

            commit('INIT_SINGLE_COMMENTS', {
                fullPath: rootState.route.fullPath,
                getters
            });
        },
        fetchPage: async ({ getters, commit, rootState }, payload) => {
            const response = await fetchPage({
                fields: [
                    'id', 'link', 'title', 'date', 'modified', 'content',
                    'comments_number', 'yoast_meta'
                ],
                slug: rootState.route.path,
                ...payload
            });

            if (!response) return;

            commit('ADD_SINGLE', {
                fullPath: rootState.route.fullPath,
                single: response.single,
                getters
            });

            commit('ADD_HEAD_TAGS', {
                fullPath: rootState.route.fullPath,
                data: response.head,
                getters
            });

            commit('INIT_SINGLE_COMMENTS', {
                fullPath: rootState.route.fullPath,
                getters
            });
        },
        fetchSingleComments: async ({ getters, commit, rootState }) => {
            const currentPage = getters.currentPage();
            const pageComments = currentPage.comments;
            const pageSingleId = currentPage.single.id;
            let commentsFrom = null;

            if (!currentPage || !pageSingleId) throw Error('`fetchSingleComments` needs `page` or `pageSingleId`.');

            if (Object.keys(pageComments.pageInfo).length) {
                if (pageComments.pageInfo.hasNextPage) commentsFrom = pageComments.pageInfo.endCursor;
                else return;
            }

            commit('SET_SINGLE_COMMENTS_PROPS', {
                fullPath: rootState.route.fullPath,
                data: {
                    loading: true
                },
                getters
            });

            const response = await fetchComments({
                singleId: pageSingleId,
                onPage: commentsOnPage,
                after: commentsFrom
            });

            commit('PUSH_SINGLE_COMMENTS', {
                fullPath: rootState.route.fullPath,
                data: response.nodes,
                getters
            });
            commit('SET_SINGLE_COMMENTS_PROPS', {
                fullPath: rootState.route.fullPath,
                data: {
                    loading: false,
                    pageInfo: response.pageInfo
                },
                getters
            });
        },
        postComment: async ({ getters, commit, rootState }, payload) => {
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
                    commit('ADD_SINGLE_COMMENT', {
                        fullPath: rootState.route.fullPath,
                        index: payload.index,
                        comment,
                        getters
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

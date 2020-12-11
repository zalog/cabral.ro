import Vue from 'vue';

import { fetchPosts } from './../services/posts';
import { fetchPost, fetchPage } from './../services/single';
import { fetchComments, postComment } from '../services/comments';
import { fetchCategory } from '../services/category';
import { formatTitle, formatPageTitle } from './../utils';
import { SITE } from './../utils/constants';

const pagesToKeep = 5;
const postsOnPage = 12;
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
        },
        currentPageTitle: (state, getters) => () => {
            const page = getters.currentPage();

            if (!page.head) return;

            return formatPageTitle(page.head.title);
        }
    },

    mutations: {
        ADD_PAGE: (state, payload) => {
            state.push({[payload.fullPath]: {}});
        },
        ADD_PAGE_SECTION: (state, payload) => {
            const currentPage = payload.getters.currentPage(payload.fullPath);

            Vue.set(currentPage, 'sections', {
                [payload.section]: {
                    ...(currentPage.sections && {
                        ...currentPage.sections[payload.section]
                    }),
                    ...payload.data
                }
            });

            if (state.length > pagesToKeep) state.shift();
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

            Vue.set(currentPage, 'head', {...data});
        },
        SET_HEAD_TITLE: (state, payload) => {
            const currentPage = payload.getters.currentPage(payload.fullPath);

            currentPage.head.title = payload.data;
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

            if (currentPage.sections) return;

            const headTags = {
                title: SITE.TITLE,
                titleTemplate: false
            };

            const pageS = rootState.route.query.s;
            if (pageS) {
                headTags.title = `Caută după "${pageS}"`;
                delete headTags.titleTemplate;
            }

            const pageNumber = rootState.route.params.id;
            if (pageNumber) {
                headTags.title = formatTitle([
                    headTags.title,
                    `pagina ${pageNumber}`
                ]);
            }

            commit('ADD_HEAD_TAGS', {
                fullPath: rootState.route.fullPath,
                data: headTags,
                getters
            });

            await dispatch('fetchPosts', {
                pageLoading: true
            });
        },
        fetchPageCategory: async({ getters, commit, rootState, dispatch }, payload) => {
            const currentPage = getters.currentPage();

            if (!currentPage) commit('ADD_PAGE', {fullPath: rootState.route.fullPath});

            if (currentPage.sections) return;

            await dispatch('fetchPosts', {
                categories: [payload.slug],
                pageLoading: true
            });

            const responseCategory = await fetchCategory({
                params: {
                    slug: payload.slug
                }
            });

            commit('ADD_PAGE_SECTION', {
                fullPath: rootState.route.fullPath,
                section: 'main',
                data: {
                    title: responseCategory.category.name,
                    description: responseCategory.category.description
                },
                getters
            });

            commit('ADD_HEAD_TAGS', {
                fullPath: rootState.route.fullPath,
                data: responseCategory.head,
                getters
            });

            const pageNumber = rootState.route.params.id;
            if (pageNumber) {
                const pageTitle = formatTitle([
                    responseCategory.category.name,
                    `pagina ${pageNumber}`
                ]);
                commit('SET_HEAD_TITLE', {
                    fullPath: rootState.route.fullPath,
                    data: pageTitle,
                    getters
                });
            }
        },
        fetchPagePost: async({ getters, commit, rootState }) => {
            const currentPage = getters.currentPage();

            if (!currentPage) commit('ADD_PAGE', {fullPath: rootState.route.fullPath});

            if (currentPage.single) return;

            const responsePost = await fetchPost({
                fields: [
                    'id', 'link', 'title', 'date', 'modified', 'content',
                    'embed', 'embed_featured_media', 'comments_number', 'yoast_meta', 'jetpack-related-posts'
                ],
                embed_featured_media_size: 'full',
                slug: rootState.route.path,
                pageLoading: true
            });

            if (!responsePost) return;

            commit('ADD_SINGLE', {
                fullPath: rootState.route.fullPath,
                single: responsePost.single,
                getters
            });

            commit('ADD_HEAD_TAGS', {
                fullPath: rootState.route.fullPath,
                data: responsePost.head,
                getters
            });

            commit('ADD_RELATED', {
                fullPath: rootState.route.fullPath,
                data: responsePost.related,
                getters
            });

            commit('INIT_SINGLE_COMMENTS', {
                fullPath: rootState.route.fullPath,
                getters
            });
        },
        fetchPagePage: async({ getters, commit, rootState }) => {
            const currentPage = getters.currentPage();

            if (!currentPage) commit('ADD_PAGE', {fullPath: rootState.route.fullPath});

            if (currentPage.single) return;

            const responsePage = await fetchPage({
                fields: [
                    'id', 'link', 'title', 'date', 'modified', 'content',
                    'comments_number', 'yoast_meta'
                ],
                slug: rootState.route.path,
                pageLoading: true
            });

            if (!responsePage) return;

            commit('ADD_SINGLE', {
                fullPath: rootState.route.fullPath,
                single: responsePage.single,
                getters
            });

            commit('ADD_HEAD_TAGS', {
                fullPath: rootState.route.fullPath,
                data: responsePage.head,
                getters
            });

            commit('INIT_SINGLE_COMMENTS', {
                fullPath: rootState.route.fullPath,
                getters
            });
        },
        fetchPageSingle: async ({ dispatch }) => {
            await dispatch('fetchPagePost') || await dispatch('fetchPagePage');
        },
        fetchPosts: async ({ getters, commit, rootState }, payload) => {
            const payloadPosts = {
                params: {
                    fields: [
                        'title', 'slug', 'excerpt', 'date', 'modified',
                        'embed', 'embed_featured_media', 'comments_number'
                    ],
                    ...(rootState.route.query.s && {
                        search: rootState.route.query.s
                    }),
                    ...payload.params
                },
                pagination: {
                    itemsOnPage: postsOnPage,
                    currentPage: parseInt(rootState.route.params.id) || 1
                }
            };
            delete payload.params;
            Object.assign(payloadPosts, payload);

            const response = await fetchPosts(payloadPosts);

            commit('ADD_PAGE_SECTION', {
                fullPath: rootState.route.fullPath,
                section: 'main',
                data: {
                    posts: {
                        posts: response.posts,
                        pagination: response.pagination
                    }
                },
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

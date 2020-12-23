import Vue from 'vue';

import { fetchPosts } from '~/services/posts';
import { formatTitle, formatPageTitle } from '~/src/utils';
import { SITE } from '~/src//utils/constants';

const pagesToKeep = 5;
const postsOnPage = 12;

export const state = () => ([]);

export const getters = {
    currentPage: (state) => (path, passedState) => {
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
};

export const mutations = {
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
    ADD_HEAD_TAGS: (state, payload) => {
        const currentPage = payload.getters.currentPage(payload.fullPath);
        const data = payload.data;

        Vue.set(currentPage, 'head', {...data});
    }
};

export const actions = {
    fetchPageHome: async({ getters, commit, dispatch }, payload) => {
        const pageKey = payload.route.fullPath;
        const currentPage = getters.currentPage(pageKey);

        if (!currentPage) commit('ADD_PAGE', {fullPath: pageKey});

        if (currentPage.sections) return;

        const headTags = {
            title: SITE.TITLE,
            titleTemplate: false
        };

        const pageS = payload.route.query.s;
        if (pageS) {
            headTags.title = `Caută după "${pageS}"`;
            delete headTags.titleTemplate;
        }

        const pageNumber = payload.route.params.id;
        if (pageNumber) {
            headTags.title = formatTitle([
                headTags.title,
                `pagina ${pageNumber}`
            ]);
        }

        commit('ADD_PAGE_SECTION', {
            fullPath: pageKey,
            section: 'main',
            data: {
                title: formatPageTitle(headTags.title)
            },
            getters
        });

        commit('ADD_HEAD_TAGS', {
            fullPath: pageKey,
            data: headTags,
            getters
        });

        await dispatch('fetchPosts', {
            $axios: payload.$axios,
            route: payload.route
        });
    },
    fetchPosts: async ({ getters, commit }, payload) => {
        const payloadPosts = {
            params: {
                fields: [
                    'title', 'slug', 'excerpt', 'date', 'modified',
                    'embed', 'embed_featured_media', 'comments_number'
                ],
                ...(payload.route.query.s && {
                    search: payload.route.query.s
                }),
                ...payload.params
            },
            pagination: {
                itemsOnPage: postsOnPage,
                currentPage: parseInt(payload.route.params.id) || 1
            }
        };
        delete payload.params;
        Object.assign(payloadPosts, payload, { $axios: payload.$axios });

        const response = await fetchPosts(payloadPosts);

        commit('ADD_PAGE_SECTION', {
            fullPath: payload.route.fullPath,
            section: 'main',
            data: {
                posts: {
                    posts: response.posts,
                    pagination: response.pagination
                }
            },
            getters
        });
    }
};

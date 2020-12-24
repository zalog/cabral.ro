import Vue from 'vue';

import { formatPageTitle } from '~/utils';

const pagesToKeep = 5;

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

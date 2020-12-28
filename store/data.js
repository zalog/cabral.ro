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
    SET_PAGE_DATA: (state, payload) => {
        const timestamp = new Date().getTime();
        let data = null;

        const currentPageData = payload.currentPage[payload.prop];
        if (currentPageData instanceof Array) {
            data = currentPageData.concat(payload.data);
        } else if (currentPageData instanceof Object) {
            data = { ...currentPageData, ...payload.data };
        } else {
            data = payload.data;
        }

        if (payload.currentPage) {
            Vue.set(payload.currentPage, payload.prop, data);
            Vue.set(payload.currentPage, 'timestamp', {
                ...payload.currentPage.timestamp,
                [payload.prop]: timestamp
            });
        } else {
            state.push({
                [payload.routePath]: {
                    [payload.prop]: data,
                    'timestamp': {
                        [payload.prop]: timestamp
                    }
                }
            });
        }

        if (state.length > pagesToKeep) state.shift();
    }
};

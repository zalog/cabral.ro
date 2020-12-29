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
        const pageProp = payload.routePath;
        const rootProp = payload.prop;
        let data = null;

        const currentPageData = payload.currentPage[rootProp];
        if (currentPageData instanceof Array) {
            data = [ ...currentPageData, ...payload.data ];
        } else if (currentPageData instanceof Object) {
            data = { ...currentPageData, ...payload.data };
        } else {
            data = payload.data;
        }

        if (payload.currentPage) {
            Vue.set(payload.currentPage, rootProp, data);
            Vue.set(payload.currentPage, 'timestamp', {
                ...payload.currentPage.timestamp,
                [rootProp]: timestamp
            });
        } else {
            state.push({
                [pageProp]: {
                    [rootProp]: data,
                    'timestamp': {
                        [rootProp]: timestamp
                    }
                }
            });
        }

        if (state.length > pagesToKeep) state.shift();
    }
};

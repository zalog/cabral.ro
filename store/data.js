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
        const key = payload.routePath;
        const dataKey = payload.prop;
        let data = null;

        let page = state.find(page => page[key]);
        if (!page) {
            state.push({
                [key]: {}
            });
            page = state[state.length - 1];
        }

        const pageData = page[key];
        if (pageData instanceof Array) {
            data = [ ...pageData, ...payload.data ];
        } else if (pageData instanceof Object) {
            data = { ...pageData, ...payload.data };
        } else {
            data = payload.data;
        }

        Vue.set(pageData, dataKey, data);
        Vue.set(pageData, 'timestamp', {
            ...pageData.timestamp,
            [dataKey]: timestamp
        });

        if (state.length > pagesToKeep) state.shift();
    }
};

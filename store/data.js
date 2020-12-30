import Vue from 'vue';

import { formatPageTitle } from '~/utils';

const pagesToKeep = 5;

export const state = () => ({});

export const getters = {
    currentPage: (state) => (path, passedState) => {
        state = passedState || state;

        const pages = state;
        const page = pages[path];
        return page || false;
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

        if (!state[key]) Vue.set(state, key, {});

        const page = state[key];

        if (page instanceof Array) {
            data = [ ...page, ...payload.data ];
        } else if (page instanceof Object) {
            data = { ...page, ...payload.data };
        } else {
            data = payload.data;
        }

        Vue.set(page, dataKey, data);
        Vue.set(page, 'timestamp', {
            ...page.timestamp,
            [dataKey]: timestamp
        });

        if (Object.keys(state).length > pagesToKeep) {
            const keyToDelete = Object.keys(state).reduce((prev, curr) =>
                state[prev].timestamp.main < state[curr].timestamp.main ? prev : curr);
            delete state[keyToDelete];
        }
    }
};

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

        if (payload.currentPage) {
            const payloadData = payload.currentPage[payload.prop];
            let data = null;

            if (!payloadData) {
                data = payload.data;
            } else if (Array.isArray(payloadData)) {
                data = payloadData.concat(payload.data);
            } else if (typeof payloadData === 'object' && payloadData !== null) {
                data = { ...payloadData, ...payload.data };
            }

            Vue.set(payload.currentPage, payload.prop, data);
            Vue.set(payload.currentPage, 'timestamp', {
                ...payload.currentPage.timestamp,
                [payload.prop]: timestamp
            });
        } else {
            state.push({
                [payload.routePath]: {
                    [payload.prop]: payload.data,
                    'timestamp': {
                        [payload.prop]: timestamp
                    }
                }
            });
        }

        if (state.length > pagesToKeep) state.shift();
    }
};

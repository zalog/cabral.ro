import { formatPageTitle } from '~/utils';
import { get, set } from './../utils/store';

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
        const dataKeys = [payload.routePath, ...payload.prop.split('.')];
        const dataKeyPage = dataKeys[0];
        const dataKeyFirst = dataKeys[1];
        const dataCurrent = get(state, dataKeys);
        let data = null;

        if (dataCurrent instanceof Array) {
            const payloadData = (payload.data instanceof Array) ? payload.data : [payload.data];
            if (!payload.unshift) {
                data = [ ...dataCurrent, ...payloadData ];
            } else {
                data = [ ...payloadData, ...dataCurrent ];
            }
        } else if (dataCurrent instanceof Object) {
            data = { ...dataCurrent, ...payload.data };
        } else if (payload.type === 'array') {
            const payloadData = (payload.data instanceof Array) ? payload.data : [payload.data];
            data = payloadData;
        } else {
            data = payload.data;
        }

        set(state, dataKeys, data);

        set(state, [dataKeyPage, 'timestamp', dataKeyFirst], new Date().getTime());

        if (Object.keys(state).length > pagesToKeep) {
            const keyToDelete = Object.keys(state).reduce((prev, curr) =>
                state[prev].timestamp.main < state[curr].timestamp.main ? prev : curr);
            delete state[keyToDelete];
        }
    }
};

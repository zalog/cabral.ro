import { formatPageTitle } from '~/utils';
import { get, set } from '../utils/store';

const pagesToKeep = 5;

export default {
    state: () => ({}),

    getters: {
        currentPage: (state) => (path, passedState) => {
            state = passedState || state;
            path = path.split('#')[0];

            const pages = state;
            const page = pages[path];
            return page || false;
        },
        currentPageTitle: (state, getters) => (path) => {
            const page = getters.currentPage(path);

            if (!page.head) return undefined;

            return formatPageTitle(page.head.title);
        },
    },

    mutations: {
        SET_PAGE_DATA: (state, payload) => {
            const path = payload.routePath.split('#')[0];
            const dataKeys = [path, ...payload.prop.split('.')];
            const dataKeyPage = dataKeys[0];
            const dataKeyFirst = dataKeys[1];
            const dataCurrent = get(state, dataKeys);
            let data = null;

            if (dataCurrent instanceof Array || payload.type === 'array') {
                const payloadData = (payload.data instanceof Array) ? payload.data : [payload.data];

                if (dataCurrent) {
                    if (!payload.unshift) data = [...dataCurrent, ...payloadData];
                    else data = [...payloadData, ...dataCurrent];
                } else {
                    data = payloadData;
                }
            } else if (dataCurrent instanceof Object || payload.type === 'object') {
                data = { ...dataCurrent, ...payload.data };
            } else {
                data = payload.data;
            }

            set(state, dataKeys, data);

            set(state, [dataKeyPage, 'timestamp', dataKeyFirst], new Date().getTime());

            const stateKeys = Object.keys(state);
            if (stateKeys.length > pagesToKeep) {
                const keyToDelete = stateKeys
                    .filter((key) => key !== dataKeyPage)
                    .reduce((prev, curr) => {
                        if (state[prev].timestamp.main < state[curr].timestamp.main) {
                            return prev;
                        }

                        return curr;
                    });

                delete state[keyToDelete];
            }
        },
    },

    actions: {
        setPageData: ({ commit }, payload) => {
            commit('SET_PAGE_DATA', {
                prop: payload.prop,
                data: payload.data,
                routePath: payload.route.fullPath,
            });
        },
    },
};

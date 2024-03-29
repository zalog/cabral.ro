import { formatPageTitle } from '~/utils';
import { get, set, del } from '../utils/store';

const pagesToKeep = 5;

export default {
    state: () => ({}),

    getters: {
        currentPage: (storeState) => (path, passedState) => {
            const state = passedState || storeState;
            const [pathClean] = path.split('#');
            const pages = state;
            const page = pages[pathClean];

            return page || false;
        },
        currentPageTitle: (_state, getters) => (path) => {
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

            if (Array.isArray(dataCurrent) || payload.type === 'array') {
                const payloadData = (Array.isArray(payload.data)) ? payload.data : [payload.data];

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
            const keyPages = stateKeys.filter((key) => key !== dataKeyPage && key[0] === '/' && state[key].timestamp);
            if (keyPages.length > pagesToKeep) {
                const keyToDelete = keyPages.reduce((prev, curr) => {
                    if (state[prev].timestamp.main < state[curr].timestamp.main) {
                        return prev;
                    }

                    return curr;
                });

                del(state, [keyToDelete]);
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

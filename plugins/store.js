import { createStore } from 'vuex';
import { defineNuxtPlugin } from '#imports';
import data from '~/store/data';
import ui from '~/store/ui';
import uiClient from '~/store/ui/client';

const registerModules = (store, modules) => {
    const preserveStateCheck = (state, path) => {
        if (!path.length) return !!state;

        const currentPathKey = path[0];
        return !!preserveStateCheck(state[currentPathKey], path.slice(1));
    };

    modules.forEach((module) => {
        if (store.hasModule(module.name)) return;

        Object.assign(module, {
            options: {
                ...module.options,
                ...(
                    module.preserveStateCheck && {
                        preserveState: preserveStateCheck(store.state, module.name),
                    }
                ),
            },
        });

        store.registerModule(
            module.name,
            module.imported,
            module.options,
        );
    });
};

export default defineNuxtPlugin({
    name: 'store',
    enforce: 'pre',
    setup(nuxtApp) {
        const store = createStore({
            modules: {
                data: { namespaced: true, ...data },
                ui: {
                    namespaced: true,
                    ...ui,
                    modules: {
                        client: { namespaced: true, ...uiClient },
                    },
                },
            },
        });
        store.$registerModules = (modules) => registerModules(store, modules);

        nuxtApp.vueApp.use(store);

        if (import.meta.server) {
            Object.assign(nuxtApp.payload, { vuex: store.state });
        } else if (nuxtApp.payload.vuex) {
            store.replaceState(nuxtApp.payload.vuex);
        }

        return {
            provide: {
                store,
            },
        };
    },
});

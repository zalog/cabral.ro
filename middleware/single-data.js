import { defineNuxtRouteMiddleware, useNuxtApp } from '#imports';
import dataSingle from '~/store/lazy/data-single';
import dataComments from '~/store/lazy/data-single-comments';

export default defineNuxtRouteMiddleware(async (to) => {
    const { $store: store } = useNuxtApp();
    const route = { ...to };
    const page = store.getters['data/currentPage'](to.fullPath);
    // fetchComments loads the next page when comments are already loaded
    const hasComments = Object.keys(page.comments?.pageInfo ?? {}).length > 0;

    store.$registerModules([
        { name: ['data', 'dataSingle'], imported: dataSingle, preserveStateCheck: true },
        { name: ['data', 'dataComments'], imported: dataComments, preserveStateCheck: true },
    ]);

    await store.dispatch('data/fetchPageSingle', { route });
    if (!hasComments) await store.dispatch('data/fetchComments', { route });
});

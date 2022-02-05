import { fetchPost, fetchPage } from '~/services/single';
import { isValidPropData } from '~/utils/store';

export default {
    namespaced: false,

    actions: {
        async fetchPageSingle({ dispatch }, { route }) {
            await dispatch('fetchPagePost', { route });
            await dispatch('fetchPagePage', { route });
        },
        async fetchPagePost({ getters, commit }, { route }) {
            const pageKey = route.fullPath;
            const currentPage = getters.currentPage(pageKey);
            const prop = 'main';

            if (isValidPropData(currentPage, prop)) return;

            const response = await fetchPost({
                $axios: this.$axios,
                params: {
                    embed_featured_media_size: 'full',
                    slug: route.path,
                },
                fields: [
                    'id', 'link', 'title', 'date', 'modified', 'content',
                    'embed', 'embed_featured_media', 'comments_number', 'yoast_meta', 'jetpack-related-posts',
                ],
            });

            commit('SET_PAGE_DATA', {
                prop: 'head',
                data: response.head,
                routePath: pageKey,
            });

            commit('SET_PAGE_DATA', {
                prop,
                data: response.main,
                routePath: pageKey,
            });

            commit('SET_PAGE_DATA', {
                prop: 'related',
                data: response.related,
                routePath: pageKey,
            });
        },
        async fetchPagePage({ getters, commit }, payload) {
            const pageKey = payload.route.fullPath;
            const currentPage = getters.currentPage(pageKey);
            const prop = 'main';

            if (isValidPropData(currentPage, prop)) return;

            const response = await fetchPage({
                $axios: this.$axios,
                params: {
                    slug: payload.route.path,
                },
                fields: [
                    'id', 'link', 'title', 'date', 'modified', 'content',
                    'comments_number', 'yoast_meta',
                ],
            });

            commit('SET_PAGE_DATA', {
                prop: 'head',
                data: response.head,
                routePath: pageKey,
            });

            commit('SET_PAGE_DATA', {
                prop,
                data: response.main,
                routePath: pageKey,
            });
        },
    },
};

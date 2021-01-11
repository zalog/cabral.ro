import { fetchPost, fetchPage } from '~/services/single';
import { isValidPropData } from '~/utils/store';

export default {
    namespaced: false,

    actions: {
        fetchPageSingle: async function({ dispatch }, payload) {
            await dispatch('fetchPagePost', payload) || await dispatch('fetchPagePage', payload);
        },
        fetchPagePost: async function({ getters, commit }, payload) {
            const pageKey = payload.route.fullPath;
            const currentPage = getters.currentPage(pageKey);
            const prop = 'main';

            if (isValidPropData(currentPage, prop)) return;

            const responsePost = await fetchPost({
                $axios: this.$axios,
                params: {
                    _fields: [
                        'id', 'link', 'title', 'date', 'modified', 'content',
                        'embed', 'embed_featured_media', 'comments_number', 'yoast_meta', 'jetpack-related-posts'
                    ],
                    embed_featured_media_size: 'full',
                    slug: payload.route.path
                }
            });

            commit('SET_PAGE_DATA', {
                prop: 'main',
                data: responsePost,
                routePath: pageKey,
                currentPage
            });
        },
        fetchPagePage: async function ({ getters, commit }, payload) {
            const pageKey = payload.route.fullPath;
            const currentPage = getters.currentPage(pageKey);
            const prop = 'main';

            if (isValidPropData(currentPage, prop)) return;

            const responsePage = await fetchPage({
                $axios: this.$axios,
                params: {
                    _fields: [
                        'id', 'link', 'title', 'date', 'modified', 'content',
                        'comments_number', 'yoast_meta'
                    ],
                    slug: payload.route.path
                }
            });

            commit('SET_PAGE_DATA', {
                prop: 'main',
                data: responsePage,
                routePath: pageKey,
                currentPage
            });
        }
    }
};

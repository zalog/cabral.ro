import { fetchPost, fetchPage } from '~/services/single';
import { isValidPropData } from '~/utils/store';

export default {
    namespaced: false,

    actions: {
        async fetchPageSingle({ dispatch, getters }, { route }) {
            const {
                fullPath: pageKey,
            } = route;
            const isValidMainData = () => {
                const currentPage = () => getters.currentPage(pageKey);
                return isValidPropData(currentPage(), 'main');
            };

            if (isValidMainData()) return;

            if (!isValidMainData()) await dispatch('fetchPagePost', { route });

            if (!isValidMainData()) await dispatch('fetchPagePage', { route });
        },
        async fetchPagePost({ getters, commit }, { route }) {
            const {
                fullPath: pageKey,
                params: {
                    singleSlug: slug,
                },
            } = route;
            const currentPage = getters.currentPage(pageKey);
            const prop = 'main';

            if (isValidPropData(currentPage, prop)) return;

            const response = await fetchPost({
                $axios: this.$axios,
                params: {
                    embed_featured_media_size: 'full',
                    slug,
                },
                fields: [
                    'id', 'link', 'title', 'date', 'modified', 'content',
                    'embed', 'embed_featured_media',
                    'comments_number', 'comment_status',
                    'yoast_head_json', 'jetpack-related-posts',
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
        async fetchPagePage({ getters, commit }, { route }) {
            const {
                fullPath: pageKey,
                params: {
                    singleSlug: slug,
                },
            } = route;
            const currentPage = getters.currentPage(pageKey);
            const prop = 'main';

            if (isValidPropData(currentPage, prop)) return;

            const response = await fetchPage({
                $axios: this.$axios,
                params: {
                    slug,
                },
                fields: [
                    'id', 'link', 'title', 'date', 'modified', 'content',
                    'comments_number', 'comment_status',
                    'yoast_head_json',
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

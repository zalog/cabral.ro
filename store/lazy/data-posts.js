import { fetchPosts } from '~/services/posts';
import { isValidPropData } from '~/utils/store';

const postsOnPage = 12;

export default {
    namespaced: false,

    actions: {
        fetchPosts: async function({ getters, commit }, payload) {
            const pageKey = payload.route.fullPath;
            const currentPage = getters.currentPage(pageKey);
            const prop = 'main';

            const payloadPosts = {
                $axios: this.$axios,
                params: {
                    _fields: [
                        'title', 'slug', 'excerpt', 'date', 'modified',
                        'embed', 'embed_featured_media', 'comments_number'
                    ],
                    ...(payload.route.query.s && {
                        search: payload.route.query.s
                    })
                },
                ...(payload.categories && {
                    categories: payload.categories
                }),
                pagination: {
                    itemsOnPage: postsOnPage,
                    currentPage: parseInt(payload.route.params.id) || 1
                }
            };

            if (isValidPropData(currentPage, prop)) return;

            const response = await fetchPosts(payloadPosts);

            commit('SET_PAGE_DATA', {
                prop,
                data: response,
                routePath: pageKey
            });
        }
    }
};

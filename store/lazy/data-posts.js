import { fetchPosts } from '~/services/posts';
import { isValidPropData } from '~/utils/store';
import { formatTitle, formatPageTitle } from '~/utils';
import { SITE } from '~/utils/constants';

const postsOnPage = 12;

export default {
    namespaced: false,

    actions: {
        fetchPageListing: async function({ commit, dispatch }, payload) {
            const pageKey = payload.route.fullPath;
            let pageTitle = SITE.TITLE;

            const pageSearch = payload.route.query.s;
            if (pageSearch) {
                pageTitle = `Caută după "${pageSearch}"`;
            }

            // TODO adds category name
            const pageCategory = payload.route.params.categorySlug;
            if (pageCategory) {
                pageTitle = 'Categorie';
            }

            const pageNumber = payload.route.params.id;
            if (pageNumber) {
                pageTitle = formatTitle([
                    pageTitle,
                    `pagina ${pageNumber}`
                ]);
            }

            commit('SET_PAGE_DATA', {
                prop: 'title',
                data: formatPageTitle(pageTitle),
                routePath: pageKey
            });

            await dispatch('fetchPosts', {
                route: payload.route,
                categories: payload.categories
            });
        },
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

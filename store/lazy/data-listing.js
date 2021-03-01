import { fetchPosts, fetchCategory } from '~/services';
import { isValidPropData } from '~/utils/store';
import { formatTitle, formatPageTitle } from '~/utils';
import { SITE } from '~/utils/constants';

const postsOnPage = 12;

export default {
    namespaced: false,

    actions: {
        async fetchPageListing({ getters, commit, dispatch }, payload) {
            const pageKey = payload.route.fullPath;
            const currentPage = getters.currentPage(pageKey);
            let pageTitle = SITE.TITLE;
            let pageDescription = null;

            const pageSearch = payload.route.query.s;
            if (pageSearch) {
                pageTitle = `Caută după "${pageSearch}"`;
            }

            // TODO adds category name
            const pageCategorySlug = payload.route.params.categorySlug;
            if (pageCategorySlug) {
                if (isValidPropData(currentPage, 'title')) return;

                const responseCategory = await fetchCategory({
                    $axios: this.$axios,
                    params: {
                        slug: pageCategorySlug,
                    },
                });
                pageTitle = responseCategory.name;
                pageDescription = responseCategory.description;
            }

            const pageNumber = payload.route.params.id;
            if (pageNumber) {
                pageTitle = formatTitle([
                    pageTitle,
                    `pagina ${pageNumber}`,
                ]);
            }

            commit('SET_PAGE_DATA', {
                prop: 'title',
                data: formatPageTitle(pageTitle),
                routePath: pageKey,
            });

            commit('SET_PAGE_DATA', {
                prop: 'description',
                data: pageDescription,
                routePath: pageKey,
            });

            await dispatch('fetchPosts', {
                route: payload.route,
                categories: payload.categories,
            });
        },
        async fetchPosts({ getters, commit }, payload) {
            const pageKey = payload.route.fullPath;
            const currentPage = getters.currentPage(pageKey);
            const prop = 'main';

            const payloadPosts = {
                $axios: this.$axios,
                params: {
                    fields: [
                        'title', 'slug', 'excerpt', 'date', 'modified',
                        'embed', 'embed_featured_media', 'comments_number',
                    ],
                    ...(payload.route.query.s && {
                        search: payload.route.query.s,
                    }),
                },
                ...(payload.categories && {
                    categories: payload.categories,
                }),
                pagination: {
                    itemsOnPage: postsOnPage,
                    currentPage: parseInt(payload.route.params.id) || 1,
                },
            };

            if (isValidPropData(currentPage, prop)) return;

            const response = await fetchPosts(payloadPosts);

            commit('SET_PAGE_DATA', {
                prop,
                data: response,
                routePath: pageKey,
            });
        },
    },
};

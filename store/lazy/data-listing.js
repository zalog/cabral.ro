import { fetchPosts, fetchCategory } from '~/services';
import { isValidPropData } from '~/utils/store';
import { formatTitle, formatPageTitle } from '~/utils';
import { SITE } from '~/utils/constants';

const postsOnPage = 12;

export default {
    namespaced: false,

    actions: {
        async fetchPageListing(
            { getters, commit, dispatch },
            { route, categories },
        ) {
            const pageKey = route.fullPath;
            const currentPage = getters.currentPage(pageKey);
            let pageTitle = SITE.TITLE;
            let pageDescription = null;

            const pageSearch = route.query.s;
            if (pageSearch) {
                pageTitle = `Caută după "${pageSearch}"`;
            }

            // TODO adds category name
            const pageCategorySlug = route.params.categorySlug;
            if (pageCategorySlug) {
                if (isValidPropData(currentPage, 'title')) return;

                const responseCategory = await fetchCategory({
                    $axios: this.$axios,
                    params: {
                        slug: pageCategorySlug.split('/').pop(),
                    },
                });
                pageTitle = responseCategory.name;
                pageDescription = responseCategory.description;
            }

            const pageNumber = route.params.id;
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
                route,
                categories,
            });
        },
        async fetchPosts(
            { getters, commit },
            { route, categories },
        ) {
            const pageKey = route.fullPath;
            const currentPage = getters.currentPage(pageKey);
            const prop = 'main';

            if (isValidPropData(currentPage, prop)) return;

            const response = await fetchPosts({
                $axios: this.$axios,
                params: {
                    fields: [
                        'title', 'slug', 'excerpt', 'date', 'modified',
                        'embed', 'embed_featured_media', 'comments_number',
                    ],
                    ...(route.query.s && {
                        search: route.query.s,
                    }),
                },
                ...(categories && {
                    categories,
                }),
                pagination: {
                    itemsOnPage: postsOnPage,
                    currentPage: parseInt(route.params.id, 10) || 1,
                },
            });

            commit('SET_PAGE_DATA', {
                prop,
                data: response,
                routePath: pageKey,
            });
        },
    },
};

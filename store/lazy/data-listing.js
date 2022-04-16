import { fetchPosts, fetchCategories } from '~/services';
import { isValidPropData } from '~/utils/store';
import { formatTitle, formatPageTitle } from '~/utils';
import { SITE } from '~/utils/constants';

const postsOnPage = 12;

export default {
    namespaced: false,

    actions: {
        async fetchPageListing(
            { getters, commit, dispatch },
            {
                route,
                taxonomy = { category: '', tag: '' },
                pageNumber,
            },
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
            if (taxonomy.category) {
                const pageSlug = taxonomy.category.split('/').slice(-1)[0];

                if (isValidPropData(currentPage, 'title')) return;

                const responseCategory = await fetchCategories({
                    $axios: this.$axios,
                    params: {
                        slug: pageSlug.split('/').pop(),
                    },
                    adaptor: 'pageCategory',
                });
                pageTitle = responseCategory.name;
                pageDescription = responseCategory.description;
            }

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
                taxonomy: {
                    categories: [taxonomy.category],
                    tags: [taxonomy.tag],
                },
                pageNumber: Number(pageNumber) || null,
            });
        },
        async fetchPosts(
            { getters, commit },
            {
                route,
                taxonomy = { categories: [], tags: [] },
                pageNumber,
            },
        ) {
            const pageKey = route.fullPath;
            const currentPage = getters.currentPage(pageKey);
            const prop = 'main';

            if (isValidPropData(currentPage, prop)) return;

            const response = await fetchPosts({
                $axios: this.$axios,
                params: {
                    ...(route.query.s && {
                        search: route.query.s,
                    }),
                },
                fields: [
                    'title', 'slug', 'excerpt', 'date', 'modified',
                    'embed', 'embed_featured_media', 'comments_number',
                ],
                taxonomy,
                pagination: {
                    itemsOnPage: postsOnPage,
                    currentPage: pageNumber,
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

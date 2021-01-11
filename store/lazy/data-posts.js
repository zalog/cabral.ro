import { fetchPosts } from '~/services/posts';
import { formatTitle, formatPageTitle } from '~/utils';
import { isValidPropData } from '~/utils/store';
import { SITE } from '~/utils/constants';

const postsOnPage = 12;

export default {
    namespaced: false,

    actions: {
        fetchPageHome: async function({ dispatch }, payload) {
            let title = SITE.TITLE;

            const pageS = payload.route.query.s;
            if (pageS) {
                title = `Caută după "${pageS}"`;
            }

            const pageNumber = payload.route.params.id;
            if (pageNumber) {
                title = formatTitle([
                    title,
                    `pagina ${pageNumber}`
                ]);
            }

            await dispatch('fetchPosts', {
                route: payload.route,
                data: {
                    title: formatPageTitle(title)
                }
            });
        },
        fetchPosts: async function({ getters, commit }, payload) {
            const pageKey = payload.route.fullPath;
            const currentPage = getters.currentPage(pageKey);
            const prop = 'main';

            const payloadPosts = {
                params: {
                    _fields: [
                        'title', 'slug', 'excerpt', 'date', 'modified',
                        'embed', 'embed_featured_media', 'comments_number'
                    ],
                    ...(payload.route.query.s && {
                        search: payload.route.query.s
                    }),
                    ...payload.params
                },
                pagination: {
                    itemsOnPage: postsOnPage,
                    currentPage: parseInt(payload.route.params.id) || 1
                }
            };
            delete payload.params;
            Object.assign(payloadPosts, payload, { $axios: this.$axios });

            if (isValidPropData(currentPage, prop)) return;

            const response = await fetchPosts(payloadPosts);

            commit('SET_PAGE_DATA', {
                prop,
                data: {
                    title: payload.data.title,
                    posts: {
                        posts: response.posts,
                        pagination: response.pagination
                    }
                },
                routePath: pageKey,
                currentPage
            });
        }
    }
};

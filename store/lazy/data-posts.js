import { fetchPosts } from '~/services/posts';
import { formatTitle, formatPageTitle } from '~/utils';
import { isValidPropData } from '~/utils/store';
import { SITE } from '~/utils/constants';

const postsOnPage = 12;

export default {
    namespaced: false,

    actions: {
        fetchPageHome: async function({ getters, commit, dispatch }, payload) {
            const pageKey = payload.route.fullPath;
            const currentPage = getters.currentPage(pageKey);

            const headTags = {
                title: SITE.TITLE,
                titleTemplate: false
            };

            const pageS = payload.route.query.s;
            if (pageS) {
                headTags.title = `Caută după "${pageS}"`;
                delete headTags.titleTemplate;
            }

            const pageNumber = payload.route.params.id;
            if (pageNumber) {
                headTags.title = formatTitle([
                    headTags.title,
                    `pagina ${pageNumber}`
                ]);
            }

            commit('SET_PAGE_DATA', {
                prop: 'head',
                data: headTags,
                routePath: pageKey,
                currentPage
            });

            await dispatch('fetchPosts', {
                route: payload.route,
                data: {
                    title: formatPageTitle(headTags.title)
                }
            });
        },
        fetchPosts: async function({ getters, commit }, payload) {
            const pageKey = payload.route.fullPath;
            const currentPage = getters.currentPage(pageKey);
            const prop = 'main';

            const payloadPosts = {
                params: {
                    fields: [
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

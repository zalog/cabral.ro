import { fetchPosts } from '~/services/posts';
import { formatTitle, formatPageTitle } from '~/utils';
import { SITE } from '~/utils/constants';

const postsOnPage = 12;

export default {
    namespaced: false,

    actions: {
        fetchPageHome: async function({ getters, commit, dispatch }, payload) {
            const pageKey = payload.route.fullPath;
            const currentPage = getters.currentPage(pageKey);

            if (!currentPage) commit('ADD_PAGE', {fullPath: pageKey});

            if (currentPage.sections) return;

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

            commit('ADD_PAGE_SECTION', {
                fullPath: pageKey,
                section: 'main',
                data: {
                    title: formatPageTitle(headTags.title)
                },
                getters
            });

            commit('ADD_HEAD_TAGS', {
                fullPath: pageKey,
                data: headTags,
                getters
            });

            await dispatch('fetchPosts', {
                route: payload.route
            });
        },
        fetchPosts: async function({ getters, commit }, payload) {
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

            const response = await fetchPosts(payloadPosts);

            commit('ADD_PAGE_SECTION', {
                fullPath: payload.route.fullPath,
                section: 'main',
                data: {
                    posts: {
                        posts: response.posts,
                        pagination: response.pagination
                    }
                },
                getters
            });
        }
    }
};

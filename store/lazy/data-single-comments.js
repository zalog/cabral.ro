import { fetchComments, postComment } from '~/services/comments';

export default {
    namespaced: false,

    actions: {
        fetchComments: async function({ getters, commit }, payload) {
            const pageKey = payload.route.fullPath;
            const currentPage = getters.currentPage(pageKey);
            const pageComments = currentPage.comments;
            const pageSingleId = currentPage.main.single.id;
            let commentsFrom = null;

            if (!currentPage || !pageSingleId) throw Error('`fetchSingleComments` needs `page` or `pageSingleId`.');

            if (pageComments && Object.keys(pageComments.pageInfo).length) {
                if (pageComments.pageInfo.hasNextPage) commentsFrom = pageComments.pageInfo.endCursor;
                else return;
            }

            const response = await fetchComments({
                $axios: this.$axios,
                singleId: pageSingleId,
                after: commentsFrom
            });

            commit('SET_PAGE_DATA', {
                routePath: pageKey,
                prop: 'comments.nodes',
                data: response.nodes
            });
            commit('SET_PAGE_DATA', {
                routePath: pageKey,
                prop: 'comments.pageInfo',
                data: response.pageInfo
            });
        },
        postComment: async function({ commit, dispatch }, payload) {
            const pageKey = payload.route.fullPath;

            try {
                const comment = await postComment({
                    $axios: this.$axios,
                    params: payload.params
                });

                if (comment.status === 'approved') {
                    const payloadCommit = {
                        routePath: pageKey,
                        prop: 'comments.nodes',
                        data: comment,
                        type: 'array',
                        unshift: true
                    };

                    if (typeof payload.index === 'number') {
                        payloadCommit.prop = `${payloadCommit.prop}.${payload.index}.replies.nodes`;
                        payloadCommit.unshift = false;
                    }

                    commit('SET_PAGE_DATA', payloadCommit);
                }

                let toastMessage = `${comment.author.name}, comentariul tău`;
                if (comment.status === 'hold') toastMessage += ' urmează să fie aprobat.';
                else if (comment.status === 'spam') toastMessage = ' a fost marcat ca spam.';
                else toastMessage += ' a fost salvat!';

                dispatch('notifications/push', {
                    message: toastMessage
                }, { root: true });

                return comment.id;
            } catch (error) {
                console.error('action postComment: ', error);
            }
        }
    }
};

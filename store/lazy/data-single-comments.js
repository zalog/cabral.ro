import { fetchComments, postComment } from '~/services/comments';

export default {
    namespaced: false,

    actions: {
        async fetchComments({ getters, commit }, payload) {
            const pageKey = payload.route.fullPath;
            const currentPage = getters.currentPage(pageKey);
            const pageComments = currentPage.comments;
            const pageSingleId = currentPage.main.id;
            let commentsFrom = null;

            if (!currentPage || !pageSingleId) throw new Error('`fetchSingleComments` needs `page` or `pageSingleId`.');

            if (pageComments && Object.keys(pageComments.pageInfo).length) {
                if (pageComments.pageInfo.hasNextPage) {
                    commentsFrom = pageComments.pageInfo.endCursor;
                } else return;
            }

            const response = await fetchComments({
                $axios: this.$axios,
                singleId: pageSingleId,
                after: commentsFrom,
            });

            commit('SET_PAGE_DATA', {
                routePath: pageKey,
                prop: 'comments.nodes',
                data: response.nodes,
            });
            commit('SET_PAGE_DATA', {
                routePath: pageKey,
                prop: 'comments.pageInfo',
                data: response.pageInfo,
            });
        },
        async postComment({ commit, dispatch }, payload) {
            const pageKey = payload.route.fullPath;

            try {
                const comment = await postComment({
                    $axios: this.$axios,
                    params: payload.params,
                });

                if (comment.status === 'approved') {
                    const payloadCommit = {
                        routePath: pageKey,
                        prop: 'comments.nodes',
                        data: comment,
                        type: 'array',
                        unshift: true,
                    };

                    if (typeof payload.index === 'number') {
                        payloadCommit.prop = `${payloadCommit.prop}.${payload.index}.replies.nodes`;
                        payloadCommit.unshift = false;
                    }

                    commit('SET_PAGE_DATA', payloadCommit);
                }

                let toastMessage = `${comment.author.name}, comentariul tău`;
                let toastVariant = 'success';
                if (comment.status === 'hold') {
                    toastMessage += ' urmează să fie aprobat.';
                    toastVariant = 'info';
                } else if (comment.status === 'spam') {
                    toastMessage = ' a fost marcat ca spam.';
                    toastVariant = 'danger';
                } else {
                    toastMessage += ' a fost salvat!';
                }

                dispatch('ui/notifications/push', {
                    message: toastMessage,
                    variant: toastVariant,
                }, { root: true });

                return comment.id;
            } catch (error) {
                console.error('action postComment: ', error);
                return undefined;
            }
        },
    },
};

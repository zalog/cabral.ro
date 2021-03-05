import { ENDPOINTS } from '../utils/constants';
import { itemComment } from '../utils/adaptors';
import { objectRenameKeys } from '../utils';

export async function fetchComments(payload) {
    const params = {
        onPage: 10,
        after: null,
        ...payload,
    };

    const response = await payload.$axios({
        method: 'post',
        url: ENDPOINTS.GRAPHQL,
        data: {
            query: `
                query GET_COMMENTS_FOR_POST(
                    $id: ID,
                    $first: Int,
                    $after: String
                ) {
                    comments(
                        first: $first,
                        after: $after,
                        where: {contentId: $id}
                    ) {
                        nodes {
                            ...CommentFields
                            replies: children {
                                nodes {
                                    ...CommentFields
                                }
                            }
                        }
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                    }
                }

                fragment CommentFields on Comment {
                    commentId
                    author {
                        ... on CommentAuthor {
                            name
                            url
                        }
                    }
                    date
                    content
                }
            `,
            variables: {
                id: params.singleId,
                first: params.onPage,
                after: params.after,
            },
        },
    });

    return response.data.data.comments;
}

export async function postComment({ params, $axios }) {
    const prepareParams = objectRenameKeys({
        singleId: 'post',
        commentId: 'parent',
        name: 'author_name',
        email: 'author_email',
        site: 'author_url',
        message: 'content',
    }, params);

    try {
        const response = await $axios({
            method: 'post',
            url: ENDPOINTS.COMMENTS,
            params: prepareParams,
        });

        return itemComment(response.data);
    } catch (error) {
        throw error.response;
    }
}

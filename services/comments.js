import { ENDPOINTS } from '../utils/constants';
import { itemComment } from '../utils/adaptors';
import { objectRenameKeys } from '../utils';

export async function fetchComments({
    $axios,
    singleSlug,
    after = null,
}) {
    const onPage = 10;

    const response = await $axios({
        method: 'post',
        url: ENDPOINTS.GRAPHQL,
        data: {
            query: `
                query GET_COMMENTS_FOR_POST(
                    $singleSlug: String,
                    $first: Int,
                    $after: String
                ) {
                    comments(
                        first: $first,
                        after: $after,
                        where: {
                            contentName: $singleSlug
                            parent: null
                            order: DESC
                        }
                    ) {
                        nodes {
                            ...CommentFields
                            replies {
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
                    databaseId
                    author {
                        node {
                            name
                            url
                        }
                    }
                    date
                    content
                }
            `,
            variables: {
                singleSlug,
                first: onPage,
                after,
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

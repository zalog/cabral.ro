import { ENDPOINTS } from '../utils/constants';
import { itemComment } from '../utils/adaptors';
import { objectRenameKeys } from '../utils';

const setCharAt = (string, index, char) => string
    .substring(0, index) + char + string.substring(index + 1);

const fixCommentDate = (comment) => {
    const isFixNeeded = comment.date.indexOf(' ') === 10;

    if (!isFixNeeded) return comment;

    return {
        ...comment,
        date: setCharAt(comment.date, 10, 'T'),
    };
};

export async function fetchComments({
    singleSlug,
    after = null,
}) {
    const onPage = 10;

    const response = await $fetch(ENDPOINTS.GRAPHQL, {
        method: 'POST',
        body: {
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

    const nodes = response.data.comments.nodes.map((comment) => fixCommentDate(comment));

    return {
        ...response.data.comments,
        nodes,
    };
}

export async function postComment({ params }) {
    const prepareParams = objectRenameKeys({
        singleId: 'post',
        commentId: 'parent',
        name: 'author_name',
        email: 'author_email',
        site: 'author_url',
        message: 'content',
    }, params);

    try {
        const response = await $fetch(ENDPOINTS.COMMENTS, {
            method: 'POST',
            query: prepareParams,
        });

        return itemComment(response);
    } catch (error) {
        throw error.response;
    }
}

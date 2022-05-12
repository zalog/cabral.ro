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

    const nodes = response.data.data.comments.nodes.map((comment) => fixCommentDate(comment));

    return {
        ...response.data.data.comments,
        nodes,
    };
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

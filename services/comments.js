import { ENDPOINTS } from '../utils/constants';
import { itemComment } from '../utils/adaptors';
import { objectRenameKeys } from '../utils';

const commentFields = 'id,parent,author_name,author_url,date,content';

async function fetchReplies({ singleId, parentIds }) {
    const replies = [];
    let page = 1;
    let totalPages;

    do {
        const response = await $fetch.raw(ENDPOINTS.COMMENTS, {
            query: {
                post: singleId,
                parent: parentIds.join(','),
                per_page: 100,
                page,
                order: 'asc',
                _fields: commentFields,
            },
        });
        replies.push(...response._data);
        totalPages = parseInt(response.headers.get('x-wp-totalpages'), 10);
        page += 1;
    } while (page <= totalPages);

    return replies;
}

export async function fetchComments({
    singleId,
    page = 1,
}) {
    const response = await $fetch.raw(ENDPOINTS.COMMENTS, {
        query: {
            post: singleId,
            parent: 0,
            per_page: 10,
            page,
            order: 'desc',
            _fields: commentFields,
        },
    });
    const comments = response._data;
    const replies = comments.length
        ? await fetchReplies({
                singleId,
                parentIds: comments.map((comment) => comment.id),
            })
        : [];

    return {
        nodes: comments.map((comment) => ({
            ...itemComment(comment),
            replies: {
                nodes: replies
                    .filter((reply) => reply.parent === comment.id)
                    .map((reply) => itemComment(reply)),
            },
        })),
        pageInfo: {
            hasNextPage: page < parseInt(response.headers.get('x-wp-totalpages'), 10),
            nextPage: page + 1,
        },
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
        const response = await $fetch(ENDPOINTS.COMMENTS_POST, {
            method: 'POST',
            query: prepareParams,
        });

        return itemComment(response);
    } catch (error) {
        throw error.response;
    }
}

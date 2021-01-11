import paginate from 'jw-paginate';
import { ENDPOINTS } from '~/utils/constants';
import { itemPost } from '~/utils/adaptors';

const paginationMaxPages = 8;
const itemsOnPage = 10;

export async function fetchPosts(payload) {
    const output = {};
    const payloadDefault = {
        params: {
            _fields: [],
            search: '',
            ...payload.params
        },
        categories: [],
        pagination: {
            itemsOnPage: itemsOnPage,
            currentPage: 1
        }
    };
    delete payload.params;
    Object.assign(payloadDefault, payload);

    // posts: params
    const paramsPosts = {
        per_page: payloadDefault.pagination.itemsOnPage,
        page: payloadDefault.pagination.currentPage,
        ...(payloadDefault.params._fields.length && {
            _fields: payloadDefault.params._fields.join(',')
        }),
        ...(payloadDefault.categories.length && {
            'filter[category_name]': payloadDefault.categories.join(',')
        }),
        ...(payloadDefault.params.search && {
            search: payloadDefault.params.search
        })
    };

    // posts: fetch
    const responsePosts = await payload.$axios({
        method: 'get',
        url: ENDPOINTS.POSTS,
        params: paramsPosts
    });

    output.posts = responsePosts.data.map(post => itemPost(post));

    // posts: pagination
    const responsePagination = paginate(
        parseInt(responsePosts.headers['x-wp-total']),
        payload.pagination.currentPage,
        payload.pagination.itemsOnPage,
        paginationMaxPages
    );

    output.pagination = {
        pages: responsePagination.pages,
        currentPage: responsePagination.currentPage
    };

    return output;
}

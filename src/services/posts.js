import Vue from 'vue';
import paginate from 'jw-paginate';
import { ENDPOINTS } from './../utils/constants';
import { itemPost } from './../utils/adaptors';

const paginationMaxPages = 8;
const itemsOnPage = 10;

export async function fetchPosts(payload) {
    const params = {
        fields: [],
        pagination: {
            itemsOnPage: itemsOnPage,
            currentPage: 1
        },
        categories: [],
        ...payload
    };

    // prepare params keys to match wp-api
    params.fields.length && ( params.fields = params.fields.join(',') );
    params.categories.length && ( params.categories = params.categories.join(',') );

    params.per_page = params.pagination.itemsOnPage;
    params.page = params.pagination.currentPage;
    delete params.pagination;

    Object.entries({
        'categories': 'filter[category_name]'
    }).forEach(entry => {
        params[entry[1]] = params[entry[0]];
        delete params[entry[0]];
    });

    // posts: fetch
    const responsePosts = await Vue.prototype.$http({
        method: 'get',
        url: ENDPOINTS.POSTS,
        params: params
    });

    // posts: pagination
    const responsePagination = paginate(
        parseInt(responsePosts.headers['x-wp-total']),
        payload.pagination.currentPage,
        payload.pagination.itemsOnPage,
        paginationMaxPages
    );

    return {
        posts: responsePosts.data.map(post => itemPost(post)),
        pagination: {
            data: responsePagination.pages,
            currentPage: responsePagination.currentPage
        }
    };
}

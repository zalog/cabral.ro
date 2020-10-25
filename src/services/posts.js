import Vue from 'vue';
import paginate from 'jw-paginate';
import { ENDPOINTS } from './../utils/constants';
import { itemPost } from './../utils/adaptors';

const paginationMaxPages = 8;
const itemsOnPage = 10;

export async function fetchPosts(payload) {
    const payloadDefault = {
        params: {
            fields: [],
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
        ...(payloadDefault.params.fields.length && {
            fields: payloadDefault.params.fields.join(',')
        }),
        ...(payloadDefault.categories.length && {
            'filter[category_name]': payloadDefault.categories.join(',')
        }),
        ...(payloadDefault.params.search && {
            search: payloadDefault.params.search
        }),
        per_page: payloadDefault.pagination.itemsOnPage,
        page: payloadDefault.pagination.currentPage
    };

    // posts: fetch
    const responsePosts = await Vue.prototype.$http({
        method: 'get',
        url: ENDPOINTS.POSTS,
        params: paramsPosts
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

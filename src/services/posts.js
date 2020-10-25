import Vue from 'vue';
import { ENDPOINTS } from './../utils/constants';
import { itemPost } from './../utils/adaptors';

export async function fetchPosts(payload) {
    const params = {
        fields: [],
        pagination: {
            itemsOnPage: 10,
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

    const response = await Vue.prototype.$http({
        method: 'get',
        url: ENDPOINTS.POSTS,
        params
    });

    return {
        headers: response.headers,
        data: {
            posts: response.data.map(post => itemPost(post))
        }
    };
}

import Vue from 'vue';
import { ENDPOINTS } from './../utils/constants';
import { itemPost } from './../utils/adaptors';

export async function fetchPosts(payload) {
    let params = {
        fields: [],
        itemsOnPage: 10,
        currentPage: 1,
        categories: [],
        ...payload
    };

    // prepare params data values
    params.fields.length && ( params.fields = params.fields.join(',') );
    params.categories.length && ( params.categories = params.categories.join(',') );

    // renames params keys to match wp-api
    Object.entries({
        'itemsOnPage': 'per_page',
        'currentPage': 'page',
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

    delete response.config;
    delete response.request;
    response.data = response.data.map(post => itemPost(post));

    return response;
}

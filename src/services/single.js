import Vue from 'vue';
import { ENDPOINTS } from './../utils/constants';
import { singlePost, singlePage } from './../utils/adaptors';

export async function fetchPost(payload) {
    const params = {
        fields: [],
        ...payload
    };

    // prepare params data values
    params.fields.length && ( params.fields = params.fields.join(',') );

    const response = await Vue.prototype.$http({
        method: 'get',
        url: `${ENDPOINTS.POSTS}`,
        params
    });

    if (!response.data.length) return false;

    return singlePost(response.data[0]);
}

export async function fetchPage(payload) {
    const params = {
        fields: [],
        ...payload
    };

    // prepare params data values
    params.fields.length && ( params.fields = params.fields.join(',') );

    const response = await Vue.prototype.$http({
        method: 'get',
        url: `${ENDPOINTS.PAGES}`,
        params
    });

    if (!response.data.length) return false;

    return singlePage(response.data[0]);
}

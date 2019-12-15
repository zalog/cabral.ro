import Vue from 'vue';
import { ENDPOINTS } from './../utils/constants';

export async function fetchPost(payload) {
    let params = {
        fields: [],
        ...payload
    };

    const response = await Vue.prototype.$http({
        method: 'get',
        url: `${ENDPOINTS.POSTS}`,
        params
    });

    if (!response.data.length) return false;

    return response.data[0];
}

export async function fetchPage(payload) {
    let params = {
        fields: [],
        ...payload
    };

    const response = await Vue.prototype.$http({
        method: 'get',
        url: `${ENDPOINTS.PAGES}`,
        params
    });

    if (!response.data.length) return false;

    return response.data[0];
}

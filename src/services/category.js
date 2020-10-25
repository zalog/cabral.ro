import Vue from 'vue';
import { ENDPOINTS } from './../utils/constants';
import { pageCategory } from './../utils/adaptors';

export async function fetchCategory(payload) {
    const response = await Vue.prototype.$http({
        method: 'get',
        url: ENDPOINTS.CATEGORIES,
        params: payload.params
    });

    return pageCategory(response.data[0]);
}

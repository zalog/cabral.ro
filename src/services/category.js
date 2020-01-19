import Vue from 'vue';
import { ENDPOINTS } from './../utils/constants';

export async function fetchCategory(payload) {
    const response = await Vue.prototype.$http({
        method: 'get',
        url: ENDPOINTS.CATEGORIES,
        params: payload.params
    });

    return response.data[0];
}

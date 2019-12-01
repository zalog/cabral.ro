import Vue from 'vue';
import { ENDPOINTS } from './../utils/constants';

export function postFormWpcf7(id, data) {
    return new Promise((resolve, reject) => {
        Vue.prototype.$http({
            method: 'post',
            url: ENDPOINTS.FORM_WPCF7(id),
            data
        })
            .then((response) => resolve(response.data))
            .catch((error) => reject(error.response.data));
    });
}

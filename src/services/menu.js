import Vue from 'vue';
import { ENDPOINTS } from './../utils/constants';

export function fetchMenu() {
    return new Promise((resolve, reject) => {
        Vue.prototype.$http({
            method: 'get',
            url: ENDPOINTS.MENU
        })
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
}

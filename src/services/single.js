import Vue from 'vue';
import { ENDPOINTS } from './../utils/constants';

export function fetchPost(payload) {
    let params = {
        fields: [],
        ...payload
    };

    return new Promise((resolve, reject) => {
        Vue.prototype.$http({
            method: 'get',
            url: `${ENDPOINTS.POSTS}`,
            params
        })
            .then((response) => {
                if (!response.data.length) return resolve(false);

                response = response.data[0];

                return resolve(response);
            })
            .catch((error) => reject(error));
    });
}

export function fetchPage(payload) {
    let params = {
        fields: [],
        ...payload
    };

    return new Promise((resolve, reject) => {
        Vue.prototype.$http({
            method: 'get',
            url: `${ENDPOINTS.PAGES}`,
            params
        })
            .then((response) => {
                if (!response.data.length) return resolve(false);

                response = response.data[0];

                return resolve(response);
            })
            .catch((error) => reject(error));
    });
}

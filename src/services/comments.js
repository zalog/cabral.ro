import Vue from 'vue';
import { ENDPOINTS } from './../utils/constants';

export function fetchComments(payload) {
  let params = {
    fields: [],
    ...payload
  };

  return new Promise((resolve, reject) => {
    Vue.prototype.$http({
      method: 'get',
      url: `${ENDPOINTS.COMMENTS}`,
      params
    })
    .then((response) => resolve({
      data: response.data,
      totalComments: response.headers['x-wp-total']
    }))
    .catch((error) => reject(error));
  });
}

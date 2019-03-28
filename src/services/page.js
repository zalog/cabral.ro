import Vue from 'vue';
import { API } from './../utils/constants';

export function fetchPage({
  slug
}) {
  return new Promise((resolve, reject) => {
    Vue.prototype.$http({
      method: 'get',
      url: `${API.PAGES}/?slug=${slug}`
    })
    .then((response) => resolve(response))
    .catch((error) => reject(error));
  });
}
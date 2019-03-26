import Vue from 'vue';
import { API } from './../utils/constants';

export function fetchPosts({
  itemsOnPage = 10,
  currentPage = 1
} = {}) {
  return new Promise((resolve, reject) => {
    Vue.prototype.$http({
      method: 'get',
      url: API.POSTS,
      params: {
        'per_page': itemsOnPage,
        'page': currentPage
      }
    })
    .then((response) => resolve(response))
    .catch((error) => reject(error));
  });
}
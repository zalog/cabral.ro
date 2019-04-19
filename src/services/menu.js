import Vue from 'vue';
import { API } from './../utils/constants';

export function fetchMenu() {
  return new Promise((resolve, reject) => {
    Vue.prototype.$http({
      method: 'get',
      url: API.MENU
    })
    .then((response) => resolve(response))
    .catch((error) => reject(error));
  });
}
import Vue from 'vue';
import { API } from './../utils/constants';

export function fetchPost(payload) {
  let params = {
    fields: [],
    ...payload
  };

  return new Promise((resolve, reject) => {
    Vue.prototype.$http({
      method: 'get',
      url: `${API.POSTS}`,
      params
    })
    .then((response) => resolve(response))
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
      url: `${API.PAGES}`,
      params
    })
    .then((response) => resolve(response))
    .catch((error) => reject(error));
  });
}
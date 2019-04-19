import Vue from 'vue';
import { API } from './../utils/constants';

export function fetchPosts(payload) {
  let params = {
    fields: [],
    itemsOnPage: 10,
    currentPage: 1,
    categories: [],
    ...payload
  };

  // prepare params data values
  params.fields.length && ( params.fields = params.fields.join(',') );
  params.categories.length && ( params.categories = params.categories.join(',') );

  // renames params keys to match wp-api
  Object.entries({
    'itemsOnPage': 'per_page',
    'currentPage': 'page',
    'categories': 'filter[category_name]'
  }).forEach(entry => {
    params[entry[1]] = params[entry[0]];
    delete params[entry[0]];
  });

  return new Promise((resolve, reject) => {
    Vue.prototype.$http({
      method: 'get',
      url: API.POSTS,
      params
    })
    .then((response) => resolve(response))
    .catch((error) => reject(error));
  });
}
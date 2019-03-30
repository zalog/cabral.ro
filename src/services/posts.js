import Vue from 'vue';
import { API } from './../utils/constants';

export function fetchPosts({
  fields = [],
  itemsOnPage = 10,
  currentPage = 1,
  categories = []
} = {}) {
  let params = {};
  fields.length && ( params['fields'] = fields.join(',') );
  itemsOnPage && ( params['per_page'] = itemsOnPage );
  currentPage && ( params['page'] = currentPage );
  categories.length && ( params['filter[category_name]'] = categories.join(',') );

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
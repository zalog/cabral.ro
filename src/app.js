import Vue from 'vue';
import App from './App.vue';
import { createStore } from './store';
import { createRouter } from './router';
import { sync } from 'vuex-router-sync';

import VueMeta from 'vue-meta';
Vue.use(VueMeta);

import http from './plugins/http';
Vue.use(http);

import Toast from 'bootstrap-vue/es/components/toast';
Vue.use(Toast);

import './scss/app.scss';

export function createApp () {
  const store = createStore();
  const router = createRouter();
  sync(store, router);

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  });

  return { app, router, store };
}
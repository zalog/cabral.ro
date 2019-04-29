import Vue from 'vue';

import webfontloader from './plugins/webfontloader';
webfontloader();

import Ripple from 'vue-ripple-directive';
Vue.directive('ripple', Ripple);

import { createApp } from './app';

const { app, router, store } = createApp();

if (window.__INITIAL_STATE__) {
  // initialize store state with data injected from server
  store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
  app.$mount('#app');
});
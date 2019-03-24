import { createApp } from './app';

const { app, router, store } = createApp();

if (window.__INITIAL_STATE__) {
  // initialize store state with data injected from server
  store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
  app.$mount('#app');
});
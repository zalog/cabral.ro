// router.js
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: () => import('./components/PageHome.vue')
      },
      {
        path: '/page/1',
        redirect: '/'
      },
      {
        path: '/page/:id',
        component: () => import('./components/PageHome.vue')
      },
      {
        path: '/:pageSlug',
        component: () => import('./components/PagePage.vue')
      },
      {
        path: '/posts',
        component: () => import('./components/PagePosts.vue')
      },
      {
        path: '/category/:categorySlug',
        component: () => import('./components/PageCategory.vue')
      },
      {
        path: '/category/:categorySlug/page/1',
        redirect: '/category/:categorySlug'
      },
      {
        path: '/category/:categorySlug/page/:id',
        component: () => import('./components/PageCategory.vue')
      },
      {
        path: '*',
        redirect: '/'
      }
    ]
  });
}
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
        component: () => import(/* webpackChunkName: "page-home" */ './pages/Home.vue')
      },
      {
        path: '/page/1/',
        pathToRegexpOptions: { strict: true },
        redirect: '/'
      },
      {
        path: '/page/:id/',
        pathToRegexpOptions: { strict: true },
        component: () => import(/* webpackChunkName: "page-home" */ './pages/Home.vue')
      },
      {
        name: 'single',
        path: '/:singleSlug/',
        pathToRegexpOptions: { strict: true },
        component: () => import(/* webpackChunkName: "page-single" */ './pages/Single.vue')
      },
      {
        path: '/:singleSlug',
        redirect: { name: 'single' }
      },
      {
        name: 'category',
        path: '/category/:categorySlug/',
        pathToRegexpOptions: { strict: true },
        component: () => import(/* webpackChunkName: "page-category" */ './pages/Category.vue')
      },
      {
        path: '/category/:categorySlug',
        redirect: { name: 'category' }
      },
      {
        path: '/category/:categorySlug/page/1/',
        pathToRegexpOptions: { strict: true },
        redirect: '/category/:categorySlug/'
      },
      {
        path: '/category/:categorySlug/page/:id/',
        pathToRegexpOptions: { strict: true },
        component: () => import(/* webpackChunkName: "page-category" */ './pages/Category.vue')
      },
      {
        path: '*',
        redirect: '/'
      }
    ]
  });
}
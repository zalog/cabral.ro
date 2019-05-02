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
        path: '/page/1',
        redirect: '/'
      },
      {
        path: '/page/:id',
        component: () => import(/* webpackChunkName: "page-home" */ './pages/Home.vue')
      },
      {
        path: '/:singleSlug',
        name: 'single',
        component: () => import(/* webpackChunkName: "page-single" */ './pages/Single.vue')
      },
      {
        path: '/category/:categorySlug',
        component: () => import(/* webpackChunkName: "page-category" */ './pages/Category.vue')
      },
      {
        path: '/category/:categorySlug/page/1',
        redirect: '/category/:categorySlug'
      },
      {
        path: '/category/:categorySlug/page/:id',
        component: () => import(/* webpackChunkName: "page-category" */ './pages/Category.vue')
      },
      {
        path: '*',
        redirect: '/'
      }
    ]
  });
}
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
        path: '/about',
        component: () => import('./components/PageAbout.vue')
      },
      {
        path: '/posts',
        component: () => import('./components/PagePosts.vue')
      },
      {
        path: '/posts/page/1',
        redirect: '/posts'
      },
      {
        path: '/posts/page/:id',
        component: () => import('./components/PagePosts.vue')
      },
      {
        path: '*',
        redirect: '/'
      }
    ]
  });
}
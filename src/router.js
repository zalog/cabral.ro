// router.js
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export function createRouter () {
    return new Router({
        mode: 'history',
        routes: [
            // homepage
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

            // single
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

            // category: redirect page 1
            {
                path: '/category/:categorySlug+/page/1',
                redirect: to => `/category/${to.params.categorySlug}/`
            },
            // category: pagination
            {
                path: '/category/:categorySlug+/page/:id',
                pathToRegexpOptions: { strict: true },
                redirect: to => `/category/${to.params.categorySlug}/page/${to.params.id}/`
            },
            {
                name: 'CategoryPage',
                path: '/category/:categorySlug+/page/:id/',
                pathToRegexpOptions: { strict: true },
                component: () => import(/* webpackChunkName: "page-category" */ './pages/Category.vue')
            },
            // category
            {
                path: '/category/:categorySlug+',
                pathToRegexpOptions: { strict: true },
                redirect: to => `/category/${to.params.categorySlug}/`
            },
            {
                name: 'Category',
                path: '/category/:categorySlug+/',
                pathToRegexpOptions: { strict: true },
                component: () => import(/* webpackChunkName: "page-category" */ './pages/Category.vue')
            },

            // other
            {
                path: '*',
                redirect: '/'
            }
        ]
    });
}

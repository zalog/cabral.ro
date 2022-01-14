import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const PageHome = () => import(/* webpackChunkName: "page-home" */ '@/pages/Home.vue').then((m) => m.default || m);
const PageCategory = () => import(/* webpackChunkName: "page-category" */ '@/pages/Category.vue').then((m) => m.default || m);
const PageSingle = () => import(/* webpackChunkName: "page-single" */ '@/pages/Single.vue').then((m) => m.default || m);
const PageSliderTest = () => import(/* webpackChunkName: "page-slider-test" */ '@/pages/SliderTest.vue').then((m) => m.default || m);

const createRouter = () => new Router({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        let output = { x: 0, y: 0 };

        if (from.hash) output = null;
        if (savedPosition) output = savedPosition;
        if (to.hash) {
            const blacklist = ['#pid'];
            const isHashBlacklisted = blacklist
                .findIndex((entry) => to.hash.indexOf(entry) === 0) >= 0
                && true;
            let selector = to.hash;

            if (isHashBlacklisted) selector = null;

            output = { selector };
        }

        return output;
    },
    routes: [
        // homepage
        {
            name: 'Home',
            path: '/',
            component: PageHome,
        },
        {
            path: '/page/1/',
            pathToRegexpOptions: { strict: true },
            redirect: '/',
        },
        {
            name: 'HomePaged',
            path: '/page/:id/',
            pathToRegexpOptions: { strict: true },
            component: PageHome,
        },

        // tests
        {
            name: 'SliderTest',
            path: '/slider-test/',
            component: PageSliderTest,
        },

        // single
        {
            name: 'Single',
            path: '/:singleSlug/',
            pathToRegexpOptions: { strict: true },
            component: PageSingle,
        },
        {
            path: '/:singleSlug',
            redirect: { name: 'Single' },
        },

        // category: redirect page 1
        {
            path: '/category/:categorySlug+/page/1',
            redirect: (to) => `/category/${to.params.categorySlug}/`,
        },
        // category: pagination
        {
            path: '/category/:categorySlug+/page/:id',
            pathToRegexpOptions: { strict: true },
            redirect: (to) => `/category/${to.params.categorySlug}/page/${to.params.id}/`,
        },
        {
            name: 'CategoryPage',
            path: '/category/:categorySlug+/page/:id/',
            pathToRegexpOptions: { strict: true },
            component: PageCategory,
        },
        // category
        {
            path: '/category/:categorySlug+',
            pathToRegexpOptions: { strict: true },
            redirect: (to) => `/category/${to.params.categorySlug}/`,
        },
        {
            name: 'Category',
            path: '/category/:categorySlug+/',
            pathToRegexpOptions: { strict: true },
            component: PageCategory,
        },
    ],
});

export { createRouter }; // eslint-disable-line import/prefer-default-export

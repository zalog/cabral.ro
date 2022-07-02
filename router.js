import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const PageHome = () => import(/* webpackChunkName: "page-home" */ '@/pages/Home.vue').then((m) => m.default || m);
const PageArchive = () => import(/* webpackChunkName: "page-archive" */ '@/pages/Archive.vue').then((m) => m.default || m);
const PageSingle = () => import(/* webpackChunkName: "page-single" */ '@/pages/Single.vue').then((m) => m.default || m);
const PageSliderTest = () => import(/* webpackChunkName: "page-slider-test" */ '@/pages/SliderTest.vue').then((m) => m.default || m);

const createRouter = () => new Router({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        let output = { x: 0, y: 0 };

        if (from.hash) output = null;
        if (savedPosition) output = savedPosition;
        if (to.hash) {
            const isHashBlacklisted = to.hash.indexOf('=') > -1;
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
            meta: {
                class: 'home',
            },
        },

        // tests
        // {
        //     name: 'SliderTest',
        //     path: '/slider-test/',
        //     component: PageSliderTest,
        // },

        // archive
        {
            path: '/(category|tag)',
            redirect: '/',
        },
        {
            path: '/(category|tag)/:slug+/(page|page/1)',
            redirect: (to) => `/${to.params.pathMatch}/${to.params.slug}/`,
        },
        {
            path: '/(category|tag)/:slug+',
            pathToRegexpOptions: { strict: true },
            redirect: (to) => `/${to.params.pathMatch}/${to.params.slug}/`,
        },
        {
            name: 'Archive',
            path: '/(category|tag)/:slug+/',
            pathToRegexpOptions: { strict: true },
            component: PageArchive,
        },

        // single
        {
            name: 'Single',
            path: '/:singleSlug/',
            alias: [
                '/:singleSlug/*',
            ],
            pathToRegexpOptions: { strict: true },
            component: PageSingle,
        },
        {
            path: '/:singleSlug',
            redirect: { name: 'Single' },
        },
    ],
});

export { createRouter }; // eslint-disable-line import/prefer-default-export

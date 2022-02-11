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

        // archive pagination
        {
            path: '/(category)/:categorySlug+/page/(1|:id)',
            redirect: (to) => {
                const page = (to.params.id > 1) ? `page/${to.params.id}/` : '';
                return `/${to.params.pathMatch}/${to.params.categorySlug}/${page}`;
            },
        },
        {
            name: 'ArchivePage',
            path: '/(category)/:categorySlug+/page/:id/',
            pathToRegexpOptions: { strict: true },
            component: PageArchive,
        },
        // archive
        {
            path: '/(category)/:categorySlug+',
            pathToRegexpOptions: { strict: true },
            redirect: (to) => `/${to.params.pathMatch}/${to.params.categorySlug}/`,
        },
        {
            name: 'Archive',
            path: '/(category)/:categorySlug+/',
            pathToRegexpOptions: { strict: true },
            component: PageArchive,
        },
    ],
});

export { createRouter }; // eslint-disable-line import/prefer-default-export

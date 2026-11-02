import { START_LOCATION } from 'vue-router';
import { useNuxtApp } from '#imports';

const PageHome = () => import('~/pages/Home.vue');
const PageArchive = () => import('~/pages/Archive.vue');
const PageSingle = () => import('~/pages/Single.vue');

const homeKey = (route) => `${route.path}?s=${route.query.s ?? ''}`;
const archiveSlug = (slug) => slug.replace(/\/page(\/1)?$/, '');
const archiveRedirect = (to) => `/${to.params.pathMatch}/${archiveSlug(to.params.slug)}/`;

export default {
    scrollBehavior(to, from, savedPosition) {
        let output = { left: 0, top: 0 };

        if (from.hash) output = false;
        if (savedPosition) output = savedPosition;
        if (to.hash) {
            const isHashBlacklisted = to.hash.includes('=');

            output = isHashBlacklisted ? false : { el: to.hash };
        }

        if (from === START_LOCATION || to.path === from.path) return output;

        const nuxtApp = useNuxtApp();
        return new Promise((resolve) => {
            nuxtApp.hooks.hookOnce('page:finish', () => resolve(output));
        });
    },
    routes: () => [
        {
            name: 'Home',
            path: '/',
            component: PageHome,
            meta: {
                key: homeKey,
            },
        },
        {
            path: '/page/1/',
            strict: true,
            redirect: '/',
        },
        {
            name: 'HomePaged',
            path: '/page/:id/',
            strict: true,
            component: PageHome,
            meta: {
                class: 'home',
                key: homeKey,
            },
        },

        {
            path: '/:pathMatch(category|tag)',
            redirect: '/',
        },
        {
            path: '/:pathMatch(category|tag)/:slug(.*[^/])',
            strict: true,
            redirect: archiveRedirect,
        },
        {
            name: 'Archive',
            path: '/:pathMatch(category|tag)/:slug(.*[^/])/',
            strict: true,
            component: PageArchive,
            beforeEnter: (to) => (
                to.params.slug === archiveSlug(to.params.slug) || archiveRedirect(to)
            ),
        },

        {
            name: 'Single',
            path: '/:singleSlug/',
            strict: true,
            component: PageSingle,
            meta: {
                middleware: 'single-data',
            },
        },
        {
            name: 'SingleNested',
            path: '/:singleSlug/:pathMatch(.+)',
            component: PageSingle,
            meta: {
                class: 'single',
                middleware: 'single-data',
            },
        },
        {
            path: '/:singleSlug',
            redirect: { name: 'Single' },
        },
    ],
};

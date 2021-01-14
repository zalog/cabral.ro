import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const PageHome = () => import(/* webpackChunkName: "page-home" */ '@/pages/Home.vue').then(m => m.default || m);
const PageSingle = () => import(/* webpackChunkName: "page-single" */ '@/pages/Single.vue').then(m => m.default || m);

export function createRouter() {
    return new Router({
        mode: 'history',
        routes: [
            // homepage
            {
                name: 'Home',
                path: '/',
                component: PageHome
            },
            {
                path: '/page/1/',
                pathToRegexpOptions: { strict: true },
                redirect: '/'
            },
            {
                name: 'HomePaged',
                path: '/page/:id/',
                pathToRegexpOptions: { strict: true },
                component: PageHome
            },

            // single
            {
                name: 'Single',
                path: '/:singleSlug/',
                pathToRegexpOptions: { strict: true },
                component: PageSingle
            },
            {
                path: '/:singleSlug',
                redirect: { name: 'Single' }
            }
        ]
    });
}

export default {
    serverMiddleware: ['~/middleware/server/spa.js'],
    components: true,
    router: {
        extendRoutes(routes, resolve) {
            // index
            const routeIndexIndex = routes.findIndex(route => route.name === 'index');
            routes.splice(routeIndexIndex + 1, 0,
                {
                    path: '/page/1/',
                    pathToRegexpOptions: { strict: true },
                    redirect: '/'
                },
                {
                    name: 'page-id',
                    path: '/page/:id/',
                    pathToRegexpOptions: { strict: true },
                    component: resolve(__dirname, 'pages/index.vue'),
                    chunkName: 'pages/index'
                }
            );

            // single
            const routeSingleIndex = routes.findIndex(route => route.name === 'singleSlug');
            routes[routeSingleIndex] = {
                ...routes[routeSingleIndex],
                path: '/:singleSlug/',
                pathToRegexpOptions: { strict: true }
            };

            routes.splice(routeSingleIndex + 1, 0,
                {
                    path: '/:singleSlug',
                    redirect: { name: 'singleSlug' }
                }
            );
        }
    },
    css: [
        '~/assets/scss/app.scss'
    ],
    plugins: [
        '~/plugins/filters.js',
        '~/plugins/vue-lazysizes.client.js'
    ],
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/svg-sprite'
    ],
    svgSprite: {
        input: '~/assets/icons/sprite',
        elementClass: null
    }
};

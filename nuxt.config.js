export default {
    serverMiddleware: ['~/middleware/server/spa.js'],
    components: true,
    router: {
        extendRoutes(routes, resolve) {
            routes.push(
                {
                    path: '/page/1/',
                    redirect: '/'
                },
                {
                    name: 'page-id',
                    path: '/page/:id?',
                    component: resolve(__dirname, 'pages/index.vue'),
                    chunkName: 'pages/index'
                }
            );
        }
    },
    css: [
        '~/assets/scss/app.scss'
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

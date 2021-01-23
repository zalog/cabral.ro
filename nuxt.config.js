export default {
    serverMiddleware: ['~/middleware/server/spa.js'],
    components: true,
    css: [
        '~/assets/scss/app.scss'
    ],
    head: {
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' }
        ]
    },
    plugins: [
        '~/plugins/filters.js',
        '~/plugins/vue-lazysizes.client.js'
    ],
    buildModules: [
        '@nuxtjs/router'
    ],
    modules: [
        '@nuxtjs/gtm',
        '@nuxtjs/axios',
        '@nuxtjs/svg-sprite'
    ],
    svgSprite: {
        input: '~/assets/icons/sprite',
        elementClass: null
    },
    publicRuntimeConfig: {
        gtm: {
            id: 'GTM-59M55JB'
        }
    }
};

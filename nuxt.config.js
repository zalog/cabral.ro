export default {
    components: true,
    css: [
        '~/assets/scss/app.scss',
    ],
    head: {
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        ],
    },
    plugins: [
        '~/plugins/store-utils.js',
        '~/plugins/router-hooks.js',
        '~/plugins/filters.js',
        '~/plugins/webfontloader.client.js',
        '~/plugins/client.js',
        '~/plugins/portal-vue.js',
    ],
    buildModules: [
        '@nuxtjs/router',
    ],
    modules: [
        '@nuxtjs/gtm',
        '@nuxtjs/axios',
        'cookie-universal-nuxt',
        '@nuxtjs/svg-sprite',
    ],
    svgSprite: {
        input: '~/assets/icons/sprite',
        elementClass: null,
    },
    publicRuntimeConfig: {
        gtm: {
            id: 'GTM-59M55JB',
        },
    },
};

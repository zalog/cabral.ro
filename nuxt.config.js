export default {
    serverMiddleware: ['~/middleware/server/spa.js'],
    components: true,
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/svg-sprite'
    ],
    svgSprite: {
        input: '~/assets/icons/sprite',
        elementClass: null
    }
};

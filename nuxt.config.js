export default {
    serverMiddleware: ['~/middleware/server/spa.js'],
    components: true,
    modules: [
        '@nuxtjs/svg-sprite'
    ],
    svgSprite: {
        input: '~/assets/icons/sprite',
        elementClass: null
    }
};

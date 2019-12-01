module.exports = ({ env }) => ({
    plugins: {
        'postcss-preset-env': {}, // default is stage 2
        'cssnano': env === 'production'
    }
});

module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/essential',
        '@nuxtjs',
        'airbnb-base',
    ],
    rules: {
        // overwrite eslint rules
        indent: ['error', 4],
        // overwrite vue/essential
        'vue/html-indent': ['error', 4],
        'vue/script-indent': ['error', 4],
    },
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module',
    },
    settings: {
        'import/resolver': {
            alias: {
                map: [
                    ['~', '.'],
                ],
                extensions: ['.vue', '.js'],
            },
        },
    },
};

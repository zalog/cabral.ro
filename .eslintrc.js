module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'eslint:recommended',
        '@nuxtjs',
        'airbnb-base',
        'plugin:vue/vue3-recommended',
    ],
    globals: {
        $fetch: 'readonly',
    },
    rules: {
        // overwrite eslint rules
        indent: ['error', 4],
        // overwrite vue/essential
        'vue/html-indent': ['error', 4],
        'vue/script-indent': ['error', 4],
        // overwrite vue/recommended (Vue 2) rules that Vue 3 code breaks
        'vue/no-v-model-argument': 'off',
        'vue/no-v-for-template-key': 'off',
        // Nuxt aliases like `#imports`
        'import/no-unresolved': ['error', { ignore: ['^#'] }],
    },
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module',
    },
    settings: {
        'import/internal-regex': '^#',
        'import/resolver': {
            node: {},
            alias: {
                map: [
                    ['~', '.'],
                ],
                extensions: ['.vue', '.js'],
            },
        },
    },
};

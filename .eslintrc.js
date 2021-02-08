module.exports = {
    'root': true,
    'env': {
        'node': true
    },
    'extends': [
        '@nuxtjs'
    ],
    'rules': {
        // overwrite eslint rules
        'indent': ['error', 4],
        // overwrite vue/essential
        'vue/html-indent': ['error', 4],
        'vue/script-indent': ['error', 4]
    },
    'parserOptions': {
        'parser': 'babel-eslint',
        'sourceType': 'module'
    }
};

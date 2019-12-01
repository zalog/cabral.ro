module.exports = {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "rules": {
        // overwrite eslint:recommended
        "semi": ["error", "always"],
        "no-console": "off",
        // other eslint
        "indent": ["error", 4],
        "quotes": ["error", "single"],
        "space-before-blocks": "error",
        "keyword-spacing": ["error"],
        "comma-dangle": ["error", "never"],
        // overwrite vue/essential
        "vue/mustache-interpolation-spacing": "error",
        "vue/html-indent": ["error", 4],
        "vue/script-indent": ["error", 4],
        "vue/order-in-components": "error"
    },
    "parserOptions": {
        "parser": "babel-eslint"
    }
};

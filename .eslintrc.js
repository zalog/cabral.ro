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
        "semi": [2, "always"],
        "no-console": "off",
        // overwrite vue/essential
        "vue/mustache-interpolation-spacing": "error",
        "vue/html-indent": ["error", 2],
        "vue/script-indent": ["error", 2],
        "vue/order-in-components": "error"
    },
    "parserOptions": {
        "parser": "babel-eslint"
    }
};

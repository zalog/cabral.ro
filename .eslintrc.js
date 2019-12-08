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
        "vue/order-in-components": ["error", {
            "order": [
                "el", // vue side effects
                "name", "parent", // vue global awareness
                "functional", // vue component type
                ["delimiters", "comments"], // vue template modifiers
                ["components", "directives", "filters"], // vue template dependencies
                "extends", "mixins", // vue composition
                "beforeRouteEnter", "beforeRouteUpdate", "beforeRouteLeave", // vue router
                "inheritAttrs", "model", ["props", "propsData"], // vue interface
                "data", "computed", // vue local state
                "watch", // vue events
                "serverPrefetch", // vue ssr
                "LIFECYCLE_HOOKS", // vue events
                "methods", // vue non-reactive properties
                "metaInfo", // vue-meta
                ["template", "render"], "renderError" // vue rendering
            ]
        }]
    },
    "parserOptions": {
        "parser": "babel-eslint"
    }
};

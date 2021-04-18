module.exports = {
    "extends": [
        "stylelint-config-standard",
        "stylelint-config-recommended-scss",
        "stylelint-config-rational-order"
    ],
    "rules": {
        "indentation": 4,
        "rule-empty-line-before": null,
        "at-rule-empty-line-before": null,
        "declaration-empty-line-before": null,
        "no-descending-specificity": null,
        "number-leading-zero": "never",
        "string-quotes": "double",

        "scss/at-import-no-partial-leading-underscore": true,
        "scss/no-duplicate-mixins": true
    }
};

module.exports = {
    extends: [
        'stylelint-config-standard-scss',
        '@stylistic/stylelint-config',
    ],
    overrides: [
        {
            files: ['**/*.vue'],
            customSyntax: 'postcss-html',
        },
    ],
    rules: {
        'rule-empty-line-before': null,
        'at-rule-empty-line-before': null,
        'declaration-empty-line-before': null,
        'no-descending-specificity': null,
        'selector-class-pattern': null,
        'selector-id-pattern': null,

        'scss/load-no-partial-leading-underscore': true,
        'scss/no-duplicate-mixins': true,
        'scss/dollar-variable-colon-space-after': 'at-least-one-space',
        'scss/dollar-variable-empty-line-before': null,

        '@stylistic/indentation': 4,
        '@stylistic/no-multiple-whitespaces': null,
        '@stylistic/number-leading-zero': 'never',
        '@stylistic/string-quotes': 'double',
    },
};

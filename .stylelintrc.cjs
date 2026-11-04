module.exports = {
    extends: [
        'stylelint-config-standard',
        '@stylistic/stylelint-config',
        'stylelint-config-recess-order',
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
        'at-rule-no-unknown': [true, {
            ignoreAtRules: ['theme', 'utility', 'variant', 'apply'],
        }],
        'at-rule-prelude-no-invalid': [true, {
            ignoreAtRules: ['apply'],
        }],
        'custom-property-empty-line-before': null,
        'custom-property-pattern': null,
        'import-notation': 'string',
        'nesting-selector-no-missing-scoping-root': [true, {
            ignoreAtRules: ['utility'],
        }],

        '@stylistic/indentation': 4,
        '@stylistic/no-multiple-whitespaces': null,
        '@stylistic/number-leading-zero': 'never',
        '@stylistic/string-quotes': 'double',
    },
};

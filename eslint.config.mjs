import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { getDefaultSelectors } from 'eslint-plugin-better-tailwindcss/defaults';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
    plugins: {
        'better-tailwindcss': betterTailwindcss,
    },
    settings: {
        'better-tailwindcss': {
            entryPoint: 'assets/css/main.css',
            selectors: [
                ...getDefaultSelectors(),
                {
                    kind: 'variable',
                    name: '^(variants|sizes|networks)$',
                    match: [{ type: 'objectValues' }],
                },
            ],
        },
    },
    rules: {
        'better-tailwindcss/enforce-canonical-classes': 'warn',
        'better-tailwindcss/enforce-consistent-class-order': 'warn',
    },
});

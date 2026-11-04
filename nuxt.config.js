import tailwindcss from '@tailwindcss/vite';
import { SITE, WP_HOST } from './utils/constants';

export default {
    modules: [
        '@nuxt/eslint',
    ],
    app: {
        head: {
            htmlAttrs: {
                lang: SITE.LANG_REGION,
            },
            noscript: [
                {
                    tagPosition: 'bodyOpen',
                    innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${SITE.GTM_ID}" height="0" width="0" style="display:none;visibility:hidden" title="gtm"></iframe>`,
                },
            ],
        },
    },
    css: [
        '~/assets/css/main.css',
    ],
    runtimeConfig: {
        wpUrl: WP_HOST,
    },
    routeRules: {
        '/**': { swr: 300 },
    },
    sourcemap: {
        client: true,
    },
    experimental: {
        payloadExtraction: false,
    },
    compatibilityDate: '2026-11-02',
    nitro: {
        storage: {
            cache: {
                driver: 'lru-cache',
                max: 1000,
            },
        },
    },
    vite: {
        plugins: [
            tailwindcss(),
        ],
        build: {
            // svg sprites are referenced by `<use href>`, which does not load data URIs
            assetsInlineLimit: (filePath) => (filePath.endsWith('.svg') ? false : undefined),
        },
    },
    eslint: {
        config: {
            stylistic: {
                indent: 4,
                semi: true,
                braceStyle: '1tbs',
                arrowParens: true,
            },
        },
    },
};

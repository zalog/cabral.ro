import { SITE } from './utils/constants';

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
        '~/assets/scss/app.scss',
    ],
    sourcemap: {
        client: true,
    },
    compatibilityDate: '2026-11-02',
    vite: {
        build: {
            // svg sprites are referenced by `<use href>`, which does not load data URIs
            assetsInlineLimit: (filePath) => (filePath.endsWith('.svg') ? false : undefined),
        },
        define: {
            'process.env.WP_URL': JSON.stringify(process.env.WP_URL),
        },
        css: {
            preprocessorOptions: {
                scss: {
                    quietDeps: true,
                    silenceDeprecations: ['import'],
                },
            },
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

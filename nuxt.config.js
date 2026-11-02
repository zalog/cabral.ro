import { SITE } from './utils/constants';

export default {
    compatibilityDate: '2026-11-02',
    css: [
        '~/assets/scss/app.scss',
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
    modules: [
        '@nuxtjs/svg-sprite',
    ],
    sourcemap: {
        client: true,
    },
    svgSprite: {
        input: '~/assets/icons/sprite',
    },
    vite: {
        build: {
            // svg sprites are referenced by `<use href>`, which does not load data URIs
            assetsInlineLimit: (filePath) => (filePath.endsWith('.svg') ? false : undefined),
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
};

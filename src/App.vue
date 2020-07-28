<template>
    <div id="app" class="app">
        <TheHeader />
        <div class="app-Content">
            <router-view></router-view>
        </div>
        <TheFooter />
    </div>
</template>

<script>
import { SITE } from './utils/constants';
import { formatHtmlTitle, decodeHtml } from './utils';

export default {
    name: 'app',

    components: {
        TheHeader: () => import(/* webpackChunkName: "app-header" */ './components/TheHeader.vue'),
        TheFooter: () => import(/* webpackChunkName: "app-footer" */ './components/TheFooter.vue')
    },

    computed: {
        currentPage: function() {
            return this.$store.getters['data/currentPage']();
        }
    },

    watch: {
        '$store.state.ui.toast'(toast) {
            this.$bvToast.toast(toast.message, {
                toaster: 'b-toaster-bottom-center',
                variant: toast.variant || 'info',
                noCloseButton: true,
                appendToast: true
            });
        }
    },

    metaInfo() {
        const output = {
            htmlAttrs: {
                lang: SITE.LANG
            },
            titleTemplate: (titleChunk) => decodeHtml(formatHtmlTitle(titleChunk)),
            link: [],
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' }
            ],
            script: [{
                vmid: 'script-gtm',
                innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${SITE.GTM_ID}');`,
                type: 'text/javascript'
            }],
            __dangerouslyDisableSanitizersByTagID: {
                'script-gtm': ['innerHTML']
            }
        };

        this.currentPage.head && Object.keys(this.currentPage.head).forEach((key) => {
            const tags = this.currentPage.head[key];

            if (typeof tags !== 'object') return;

            tags.forEach((tag) => {
                output[key].push(tag);
            });
        });

        // prevents duplicate tags after hydration
        ['link', 'meta', 'script'].forEach((key) => {
            output[key].forEach((tag, index) => {
                if (tag.vmid) return;

                tag.vmid = `${key}-${index}`;
            });
        });

        return output;
    }
};
</script>

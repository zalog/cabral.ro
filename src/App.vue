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
            titleTemplate: (titleChunk) => SITE.TITLE_TEMPLATE(titleChunk),
            link: [],
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' }
            ],
            script: [{
                vmid: 'gtm',
                innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${SITE.GTM_ID}');`,
                type: 'text/javascript'
            }],
            __dangerouslyDisableSanitizersByTagID: {
                'gtm': ['innerHTML']
            }
        };

        const pageCanonical = this.currentPage.single && this.currentPage.single.link;
        if (pageCanonical) {
            output.link.push({rel: 'canonical', href: this.currentPage.single.link});
        }

        this.currentPage.meta &&
            this.currentPage.meta.forEach((meta) => {
                output.meta.push(meta);
            });

        return output;
    }
};
</script>

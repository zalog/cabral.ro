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
import { currentPage } from './utils/mixins';

export default {
    name: 'app',

    components: {
        TheHeader: () => import(/* webpackChunkName: "app-header" */ './components/TheHeader.vue'),
        TheFooter: () => import(/* webpackChunkName: "app-footer" */ './components/TheFooter.vue')
    },

    mixins: [
        currentPage
    ],

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

        const pageHead = this.data.head;
        if (pageHead) {
            // adds title
            pageHead.title && (output.title = pageHead.title);

            // adds/modify titleTemplate
            if (Object.prototype.hasOwnProperty.call(pageHead, 'titleTemplate'))
                output.titleTemplate = pageHead.titleTemplate;

            // adds tags
            Object.keys(pageHead).forEach((key) => {
                const tags = pageHead[key];

                if (typeof tags !== 'object') return;

                tags.forEach((tag) => {
                    output[key].push(tag);
                });
            });
        }

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

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
import { SITE } from "./utils/constants";

export default {
  name: 'app',

  components: {
    TheHeader: () => import(/* webpackChunkName: "app-header" */ './components/TheHeader.vue'),
    TheFooter: () => import(/* webpackChunkName: "app-footer" */ './components/TheFooter.vue')
  },

  metaInfo: {
    htmlAttrs: {
      lang: SITE.LANG
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' }
    ],
    titleTemplate: (titleChunk) => titleChunk ? `${titleChunk} - ${SITE.TITLE}` : SITE.TITLE
  }
};
</script>

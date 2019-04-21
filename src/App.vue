<template>
  <div id="app" class="app">
    <TheHeader />
    <div class="app-Content container-fluid">
      <router-view></router-view>
    </div>
    <TheFooter />
  </div>
</template>

<script>
export default {
  name: 'app',

  components: {
    TheHeader: () => import(/* webpackChunkName: "app-header" */ './components/TheHeader.vue'),
    TheFooter: () => import(/* webpackChunkName: "app-footer" */ './components/TheFooter.vue')
  }
};
</script>

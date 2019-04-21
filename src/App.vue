<template>
  <div id="app" class="app">
    <div class="app-Header">
      <TheMenu />
    </div>
    <div class="app-Content">
      <router-view></router-view>
    </div>
    <div class="app-Footer">
      footer
    </div>
  </div>
</template>

<script>
import TheMenu from './components/TheMenu.vue';

export default {
  name: 'app',

  components: {
    TheMenu
  }
};
</script>

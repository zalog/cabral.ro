<template>
  <div id="app">
    <TheMenu />

    <router-view></router-view>
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

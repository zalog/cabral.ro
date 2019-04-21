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
import TheHeader from './components/TheHeader.vue';
import TheFooter from './components/TheFooter.vue';

export default {
  name: 'app',

  components: {
    TheHeader,
    TheFooter
  }
};
</script>

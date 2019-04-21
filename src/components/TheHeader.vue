<template>
  <div class="app-Header">
    <TheHeaderMenu />
  </div>
</template>

<script>
import TheHeaderMenu from './TheHeaderMenu.vue';

export default {
  name: 'TheHeader',

  components: {
    TheHeaderMenu
  }
};
</script>

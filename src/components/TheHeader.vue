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

<style lang="scss" scoped>
/deep/ {
  @import "./../scss/app-component.scss";
  @import "~bootstrap/scss/navbar";
}
</style>
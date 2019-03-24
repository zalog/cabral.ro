<template>
  <div id="app">
    <div v-if="showMenu">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/posts">Posts</router-link>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',

  computed: {
    showMenu() {
      return this.$store.state.ui.menu;
    }
  }
};
</script>

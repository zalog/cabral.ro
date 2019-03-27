<template>
  <div>
    <router-link
      v-for="item in menu"
      :key="item.ID"
      :to="item.url"
    >{{ item.title }}</router-link>
  </div>
</template>

<script>
export default {
  name: 'TheMenu',

  computed: {
    menu() {
      return this.$store.state.ui.menu;
    }
  },

  serverPrefetch() {
    return this.fetchMenu();
  },

  methods: {
    fetchMenu() {
      return this.$store.dispatch('ui/fetchMenu');
    }
  }
};
</script>
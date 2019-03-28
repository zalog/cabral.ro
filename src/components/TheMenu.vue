<template>
  <div>
    <router-link
      v-for="item in menu"
      :key="item.ID"
      :to="menuItemTo(item.url)"
    >{{ item.title }} {{ item.object }} / </router-link>
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
    },
    menuItemTo: (url) => url.replace('https://www.cabral.ro', '')
  }
};
</script>
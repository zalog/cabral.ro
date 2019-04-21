<template>
  <div>
    <router-link
      v-for="item in menu"
      :key="item.ID"
      :to="menuItemTo(item)"
    >{{ item.title }} / </router-link>
  </div>
</template>

<script>
export default {
  name: 'TheHeaderMenu',

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
    menuItemTo: (item) => {
      let url = new URL(item.url, 'https://www.cabral.ro');

      let output = url.pathname;

      if (['post', 'page'].indexOf(item.object) !== -1) {
        output = {
          name: 'single',
          params: {
            singleSlug: url.pathname.slice(1, -1),
            singleType: item.object
          }
        };
      }

      return output;
    }
  }
};
</script>
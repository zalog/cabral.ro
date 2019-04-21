<template>
  <b-navbar toggleable="md" type="dark" variant="info">
    <b-navbar-brand :to="'/'">Cabral.ro</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item
          v-for="item in menu"
          :key="item.ID"
          :to="menuItemTo(item)"
          :active="menuItemActive(item)"
        >{{ item.title }}</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import BNavbar from 'bootstrap-vue/es/components/navbar/navbar';
import BNavbarNav from 'bootstrap-vue/es/components/navbar/navbar-nav';
import BNavbarBrand from 'bootstrap-vue/es/components/navbar/navbar-brand';
import BNavbarToggle from 'bootstrap-vue/es/components/navbar/navbar-toggle';
import BCollapse from 'bootstrap-vue/es/components/collapse/collapse';
import BNavItem from 'bootstrap-vue/es/components/nav/nav-item';

export default {
  name: 'TheHeaderMenu',

  components: {
    BNavbar,
    BNavbarNav,
    BNavbarBrand,
    BNavbarToggle,
    BCollapse,
    BNavItem
  },

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
    },
    menuItemActive: function(item) {
      item = this.menuItemTo(item);
      let itemPath = (typeof item === 'string') ? item : '/' + item.params.singleSlug;
      return this.$route.path === itemPath;
    }
  }
};
</script>

<style lang="scss">
@import "./../scss/app-component.scss";
@import "~bootstrap/scss/navbar";
</style>
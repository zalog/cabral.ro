<template>
    <div class="app-Header">
        <the-header-menu :data="$store.state.ui.menu" />
        <the-header-categories :data="$store.state.ui['nav-categories']" />
    </div>
</template>

<script>
import menu from '../store/lazy/menu';
import navCategories from '../store/lazy/nav-categories';
import TheHeaderMenu from './TheHeaderMenu.vue';
import TheHeaderCategories from './TheHeaderCategories.vue';

export default {
    components: {
        TheHeaderMenu,
        TheHeaderCategories,
    },

    async fetch() {
        this.$store.registerModule(['ui', 'menu'], menu, { preserveState: false });
        await this.$store.dispatch('ui/menu/fetch');

        this.$store.registerModule(['ui', 'nav-categories'], navCategories, { preserveState: false });
        await this.$store.dispatch('ui/nav-categories/fetch');
    },
};
</script>

<template>
    <div class="app-Header">
        <the-header-menu
            :data-menu="$store.state.ui.menu"
            :data-categories="$store.state.ui['nav-categories']"
        />
    </div>
</template>

<script>
import menu from '../store/lazy/menu';
import navCategories from '../store/lazy/nav-categories';
import TheHeaderMenu from './TheHeaderMenu.vue';

export default {
    components: {
        TheHeaderMenu,
    },

    async fetch() {
        this.$store.registerModule(['ui', 'menu'], menu, { preserveState: false });
        await this.$store.dispatch('ui/menu/fetch');

        this.$store.registerModule(['ui', 'nav-categories'], navCategories, { preserveState: false });
        await this.$store.dispatch('ui/nav-categories/fetch');
    },
};
</script>

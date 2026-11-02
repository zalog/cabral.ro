<template>
    <div class="app-Header">
        <the-header-menu :data="$store.state.ui.menu" />
        <the-header-categories :data="$store.state.ui['nav-categories']" />
    </div>
</template>

<script>
import { defineNuxtComponent } from '#imports';
import menu from '../store/lazy/menu';
import navCategories from '../store/lazy/nav-categories';
import TheHeaderMenu from './TheHeaderMenu.vue';
import TheHeaderCategories from './TheHeaderCategories.vue';

export default defineNuxtComponent({
    components: {
        TheHeaderMenu,
        TheHeaderCategories,
    },

    async asyncData({ $store: store }) {
        store.registerModule(['ui', 'menu'], menu, { preserveState: false });
        await store.dispatch('ui/menu/fetch');

        store.registerModule(['ui', 'nav-categories'], navCategories, { preserveState: false });
        await store.dispatch('ui/nav-categories/fetch');

        return {};
    },
});
</script>

<style lang="scss">
@import "~/assets/scss/05-components/the-header.scss";
</style>

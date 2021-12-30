<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
        <nuxt-link
            :to="'/'"
            class="navbar-brand"
            @click.native="show.navbarBodyMain = false"
        >
            {{ SITE.TITLE }}
        </nuxt-link>

        <button
            type="button"
            class="navbar-toggler"
            aria-controls="navbar-body-main"
            :aria-expanded="show.navbarBodyMain && 'true' || 'false'"
            aria-label="Toggle navigation"
            @click="show.navbarBodyMain = !show.navbarBodyMain"
        >
            <span class="navbar-toggler-icon" />
        </button>

        <div
            id="navbar-body-main"
            class="navbar-body-main"
            :class="{ 'show': show.navbarBodyMain }"
        >
            <ul class="navbar-nav flex-grow-1">
                <li
                    v-for="item in menu"
                    :key="item.ID"
                    class="nav-item"
                >
                    <nuxt-link
                        :to="item.to"
                        class="nav-link"
                        exact-active-class="active"
                        @click.native="show.navbarBodyMain = false"
                    >
                        {{ item.title }}
                    </nuxt-link>
                </li>
            </ul>
        </div>

        <form
            action="/"
            class="navbar-body-search"
            @submit.prevent="goToSearch($event)"
        >
            <input
                type="search"
                class="form-control form-control-sm"
                name="s"
                :value="$route.query.s"
                placeholder="Caută aici..."
            >
        </form>
    </nav>
</template>

<script>
import menu from '../store/lazy/menu';
import { SITE } from '../utils/constants';

export default {
    name: 'TheHeaderMenu',

    data: () => ({
        show: {
            navbarBodyMain: false,
        },
    }),

    async fetch() {
        this.$store.registerModule(['ui', 'menu'], menu, { preserveState: false });

        await this.$store.dispatch('ui/menu/fetch');
    },

    computed: {
        menu() {
            return this.$store.state.ui.menu;
        },
    },

    beforeMount() {
        this.SITE = SITE;
    },

    methods: {
        goToSearch($event) {
            const s = $event.target.elements.s.value;

            if (!s) return;

            this.$router.push({ path: '/', query: { s } });
            this.show.navbarBodyMain = false;
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/the-header-menu";
</style>

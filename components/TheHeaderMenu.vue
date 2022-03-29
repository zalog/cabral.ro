<template>
    <nav
        class="navbar navbar-expand-xl navbar-dark bg-dark"
        :class="{ 'navbar-body-main-open': show.navbarBodyMain }"
    >
        <div class="navbar-bar">
            <nuxt-link
                :to="'/'"
                class="navbar-brand"
                @click.native="menuClose()"
            >
                {{ SITE.TITLE }}
            </nuxt-link>

            <button
                type="button"
                class="navbar-toggler"
                aria-controls="navbar-body-main"
                :aria-expanded="show.navbarBodyMain && 'true' || 'false'"
                aria-label="Toggle navigation"
                @click="toggleMenu()"
            >
                <span class="navbar-toggler-icon" />
            </button>
        </div>

        <div
            id="navbar-body-main"
            class="navbar-body-main"
        >
            <ul class="navbar-nav">
                <li
                    v-for="item in menu"
                    :key="item.ID"
                    class="nav-item"
                >
                    <nuxt-link
                        :to="item.to"
                        class="nav-link"
                        exact-active-class="active"
                        @click.native="menuClose()"
                    >
                        {{ item.title }}
                    </nuxt-link>
                </li>
            </ul>
            <portal
                to="widget-categories"
                :disabled="$mediaBreakpointDown('lg')"
            >
                <ul class="nav nav-pills nav-categories">
                    <li
                        v-for="(category, index) in categories"
                        :key="`navbar-categories-${index}`"
                        class="nav-item"
                    >
                        <nuxt-link
                            :to="category.to"
                            class="nav-link"
                            exact-active-class="active"
                            @click.native="menuClose()"
                        >
                            {{ category.title }}
                        </nuxt-link>
                    </li>
                </ul>
            </portal>
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
import navCategories from '../store/lazy/nav-categories';
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

        this.$store.registerModule(['ui', 'nav-categories'], navCategories, { preserveState: false });
        await this.$store.dispatch('ui/nav-categories/fetch');
    },

    computed: {
        menu() {
            return this.$store.state.ui.menu;
        },
        categories() {
            return this.$store.state.ui['nav-categories'];
        },
    },

    created() {
        this.SITE = SITE;

        this.initMeta();
    },

    methods: {
        initMeta() {
            const { set, remove } = this.$meta().addApp('body-class-menu');

            this.meta = {
                set: () => set({
                    bodyAttrs: { class: 'body-navbar-open' },
                }),
                remove: () => remove(),
            };
        },
        toggleMenu() {
            if (!this.show.navbarBodyMain) this.menuOpen();
            else this.menuClose();
        },
        menuOpen() {
            this.show.navbarBodyMain = true;
            this.meta.set();
        },
        menuClose() {
            this.show.navbarBodyMain = false;
            this.meta.remove();
        },
        goToSearch($event) {
            const s = $event.target.elements.s.value;

            if (!s) return;

            this.$router.push({ path: '/', query: { s } });
            this.menuClose();
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/the-header-menu";
@import "~/assets/scss/05-components/nav-categories";
</style>

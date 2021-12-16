<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
        <nuxt-link
            :to="'/'"
            class="navbar-brand"
            @click.native="navCollapse = false"
        >
            {{ SITE.TITLE }}
        </nuxt-link>

        <button
            type="button"
            class="navbar-toggler"
            :class="{ 'collapsed': navCollapse }"
            aria-controls="navbar-content"
            :aria-expanded="navCollapse && 'true' || 'false'"
            aria-label="Toggle navigation"
            @click="navCollapse = !navCollapse"
        >
            <span class="navbar-toggler-icon" />
        </button>

        <b-collapse
            id="navbar-content"
            v-model="navCollapse"
            is-nav
        >
            <ul class="navbar-nav flex-grow-1">
                <li
                    v-for="item in menu"
                    :key="item.ID"
                    class="nav-item"
                >
                    <nuxt-link
                        :to="menuItemTo(item)"
                        class="nav-link"
                        exact-active-class="active"
                        @click.native="navCollapse = false"
                    >
                        {{ item.title }}
                    </nuxt-link>
                </li>
            </ul>
        </b-collapse>

        <form
            action="/"
            @submit.prevent="goToSearch($event)"
        >
            <input
                type="search"
                class="form-control form-control-sm"
                name="s"
                placeholder="Caută aici..."
            >
        </form>
    </nav>
</template>

<script>
import { BCollapse } from 'bootstrap-vue';
import menu from '../store/lazy/menu';
import { SITE } from '../utils/constants';

export default {
    name: 'TheHeaderMenu',

    components: {
        BCollapse,
    },

    data: () => ({
        navCollapse: false,
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
        menuItemTo(item) {
            const url = new URL(item.url, SITE.LINK);
            let output = url.pathname;

            if (['post', 'page'].includes(item.object)) {
                output = {
                    name: 'Single',
                    params: {
                        singleSlug: url.pathname.slice(1, -1),
                        singleType: item.object,
                    },
                };
            }

            return output;
        },
        menuItemActive(item) {
            const menuItemTo = this.menuItemTo(item);
            const itemPath = (typeof menuItemTo === 'string') ? menuItemTo : `/${menuItemTo.params.singleSlug}/`;

            return this.$route.path === itemPath;
        },
        goToSearch($event) {
            const s = $event.target.elements.s.value;

            if (!s) return;

            this.$router.push({ path: '/', query: { s } });
            this.navCollapse = false;
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/the-header-menu";
</style>

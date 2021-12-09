<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
        <nuxt-link
            :to="'/'"
            class="navbar-brand"
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
            <b-navbar-nav class="flex-grow-1">
                <b-nav-form
                    action="/"
                    class="mr-md-auto order-last order-md-first py-3 py-md-0"
                    form-class="flex-grow-1"
                    @submit.prevent="goToSearch($event)"
                >
                    <b-form-input
                        type="search"
                        size="sm"
                        class="flex-grow-1"
                        name="s"
                        placeholder="Caută aici..."
                    />
                </b-nav-form>
                <b-nav-item
                    v-for="item in menu"
                    :key="item.ID"
                    :to="menuItemTo(item)"
                    :active="menuItemActive(item)"
                >
                    {{ item.title }}
                </b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </nav>
</template>

<script>
import {
    BNavbarNav, BNavForm, BNavItem,
    BCollapse,
    BFormInput,
} from 'bootstrap-vue';
import menu from '../store/lazy/menu';
import { SITE } from '../utils/constants';

export default {
    name: 'TheHeaderMenu',

    components: {
        BNavbarNav,
        BNavForm,
        BNavItem,
        BCollapse,
        BFormInput,
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

<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
        <nuxt-link
            :to="'/'"
            class="navbar-brand"
        >Navbar</nuxt-link>

        <button
            @click="navCollapse = !navCollapse"
            type="button"
            class="navbar-toggler"
            :class="{ 'collapsed': navCollapse }"
            aria-controls="navbar-content"
            :aria-expanded="navCollapse && 'true' || 'false'"
            aria-label="Toggle navigation"
        >
            <span class="navbar-toggler-icon"></span>
        </button>

        <b-collapse
            v-model="navCollapse"
            is-nav
            id="navbar-content"
        >
            <b-navbar-nav class="flex-grow-1">
                <b-nav-form
                    @submit.prevent="goToSearch($event)"
                    action="/"
                    class="mr-md-auto order-last order-md-first py-3 py-md-0"
                    form-class="flex-grow-1"
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
                    v-for="item in menu" :key="item.ID"
                    :to="menuItemTo(item)"
                    :active="menuItemActive(item)"
                >{{ item.title }}</b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </nav>
</template>

<script>
import menu from './../store/lazy/menu';
import { SITE } from './../utils/constants';
import {
    BNavbarNav, BNavForm, BNavItem,
    BCollapse,
    BFormInput,
} from 'bootstrap-vue';

// TODO remove this require
const Url = typeof URL !== 'undefined' && URL || require('url').parse;

export default {
    name: 'TheHeaderMenu',

    components: {
        BNavbarNav, BNavForm, BNavItem,
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

    methods: {
        menuItemTo(item) {
            const url = new Url(item.url, SITE.LINK);
            let output = url.pathname;

            if (['post', 'page'].indexOf(item.object) !== -1) {
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
            item = this.menuItemTo(item);
            const itemPath = (typeof item === 'string') ? item : '/' + item.params.singleSlug + '/';

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

<style lang="scss" scoped>
@import "~/assets/scss/app-component.scss";
@import "~bootstrap/scss/nav";
@import "~bootstrap/scss/navbar";

/deep/ {
    .form-inline {
        .form-control {
            background-color: rgba($white, .02);
            border-color: transparent;
            color: $navbar-dark-active-color;

            &:focus {
                box-shadow: none;
                background-color: rgba($white, .06);
            }
        }
    }
}
</style>

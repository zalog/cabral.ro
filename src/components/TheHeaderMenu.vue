<template>
    <b-navbar toggleable="md" type="dark" variant="dark">
        <b-navbar-brand
            v-ripple="'rgba(255, 255, 255, 0.1)'"
            :to="'/'"
        >Cabral.ro</b-navbar-brand>

        <b-navbar-toggle
            @click="navCollapse = !navCollapse"
            target=""
        />

        <b-collapse v-model="navCollapse" is-nav>
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
                    v-ripple="'rgba(255, 255, 255, 0.1)'"
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
import {
    BNavbar, BNavbarNav, BNavbarBrand, BNavForm, BNavbarToggle, BNavItem,
    BCollapse,
    BFormInput
} from 'bootstrap-vue';

export default {
    name: 'TheHeaderMenu',

    components: {
        BNavbar, BNavbarNav, BNavbarBrand, BNavForm, BNavbarToggle, BNavItem,
        BCollapse,
        BFormInput
    },

    data: () => ({
        navCollapse: false
    }),

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
            let itemPath = (typeof item === 'string') ? item : '/' + item.params.singleSlug + '/';
            return this.$route.path === itemPath;
        },
        goToSearch($event) {
            const s = $event.target.elements.s.value;

            if (!s) return;

            this.$router.push({ path: '/', query: { s } });
            this.navCollapse = false;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./../scss/app-component.scss";

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

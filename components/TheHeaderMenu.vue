<template>
    <nav
        class="navbar navbar-expand-sm navbar-dark bg-dark"
        :class="{ 'navbar-body-main-open': show.navbarBodyMain }"
    >
        <div class="container-fluid">
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
                    @click="menuToggle()"
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
                        v-for="item in data"
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
        </div>
    </nav>
</template>

<script>
import { SITE } from '../utils/constants';

export default {
    props: {
        data: {
            type: Array,
            default: () => ([]),
        },
    },

    data: () => ({
        show: {
            navbarBodyMain: false,
        },
    }),

    created() {
        this.SITE = SITE;
    },

    methods: {
        menuToggle() {
            if (!this.show.navbarBodyMain) this.menuOpen();
            else this.menuClose();
        },
        menuOpen() {
            this.show.navbarBodyMain = true;
            this.$root.$el.addEventListener('click', this.onMenuOpenClick);
            this.$root.$el.addEventListener('keydown', this.onMenuOpenKeydown);
        },
        menuClose() {
            this.show.navbarBodyMain = false;
            this.$root.$el.removeEventListener('click', this.onMenuOpenClick);
            this.$root.$el.removeEventListener('keydown', this.onMenuOpenKeydown);
        },
        goToSearch($event) {
            const s = $event.target.elements.s.value;

            if (!s) return;

            this.$router.push({ path: '/', query: { s } });
            this.menuClose();
        },
        onMenuOpenClick(event) {
            const clickedTo = (classes) => classes
                .some((className) => event.target.classList.contains(className));

            if (!clickedTo(['navbar-toggler', 'navbar-toggler-icon', 'form-control'])) {
                this.menuClose();
            }
        },
        onMenuOpenKeydown(event) {
            if (['Escape', 'Esc'].includes(event.key)) {
                this.menuClose();
            }
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/the-header-menu";
</style>

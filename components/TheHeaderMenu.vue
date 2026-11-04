<template>
    <nav class="relative flex flex-wrap items-center justify-between bg-gray-900 py-2 sm:flex-nowrap sm:justify-start sm:py-4">
        <div class="flex w-full flex-col flex-wrap justify-between px-3 *:mb-4 sm:flex-row sm:items-center sm:*:mb-0">
            <div class="flex justify-between">
                <nuxt-link
                    :to="'/'"
                    class="mr-4 py-[.3125rem] text-xl whitespace-nowrap text-white no-underline"
                    @click="menuClose()"
                >
                    {{ SITE.TITLE }}
                </nuxt-link>

                <button
                    ref="toggler"
                    type="button"
                    class="rounded-md border border-transparent px-3 py-1 text-xl leading-none text-white/55 focus:ring-4 focus:outline-none sm:hidden"
                    aria-controls="navbar-body-main"
                    :aria-expanded="show.navbarBodyMain && 'true' || 'false'"
                    aria-label="Toggle navigation"
                    @click="menuToggle()"
                >
                    <svg
                        class="inline-block size-[1.5em] align-middle"
                        viewBox="0 0 30 30"
                        aria-hidden="true"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-miterlimit="10"
                            stroke-width="2"
                            d="M4 7h22M4 15h22M4 23h22"
                        />
                    </svg>
                </button>
            </div>

            <div
                id="navbar-body-main"
                class="flex-[1_0_auto] sm:mr-4 sm:block"
                :class="{ hidden: !show.navbarBodyMain }"
            >
                <ul class="flex flex-col sm:flex-row">
                    <li
                        v-for="item in data"
                        :key="item.ID"
                    >
                        <nuxt-link
                            :to="item.to"
                            class="block py-2 text-white/55 no-underline transition-colors duration-150 ease-in-out hover:text-white/75 aria-[current=page]:text-white sm:px-2"
                            @click="menuClose()"
                        >
                            {{ item.title }}
                        </nuxt-link>
                    </li>
                </ul>
            </div>

            <form
                action="/"
                class="flex-[1_0_auto] lg:max-w-[20%]"
                @submit.prevent="goToSearch($event)"
            >
                <label
                    for="navbar-search"
                    class="sr-only"
                >
                    Caută
                </label>
                <input
                    id="navbar-search"
                    ref="search"
                    type="search"
                    class="block min-h-[calc(1.5em+.5rem+2px)] w-full appearance-none rounded-sm border border-transparent bg-white/2 bg-clip-padding px-2 py-1 text-sm text-white transition-[border-color,box-shadow] duration-150 ease-in-out placeholder:text-gray-600 focus:border-primary-300 focus:bg-white/6 focus:outline-none"
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
            document.addEventListener('click', this.onMenuOpenClick);
            document.addEventListener('keydown', this.onMenuOpenKeydown);
        },
        menuClose() {
            this.show.navbarBodyMain = false;
            document.removeEventListener('click', this.onMenuOpenClick);
            document.removeEventListener('keydown', this.onMenuOpenKeydown);
        },
        goToSearch($event) {
            const s = $event.target.elements.s.value;

            if (!s) return;

            this.$router.push({ path: '/', query: { s } });
            this.menuClose();
        },
        onMenuOpenClick(event) {
            const clickedTo = (refs) => refs
                .some((ref) => this.$refs[ref].contains(event.target));

            if (!clickedTo(['toggler', 'search'])) {
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

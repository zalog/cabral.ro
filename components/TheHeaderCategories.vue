<template>
    <ul class="nav nav-pills nav-categories">
        <li
            v-for="(category, index) in data"
            :key="`navbar-categories-${index}`"
            class="nav-item"
        >
            <nuxt-link
                :to="category.to"
                class="nav-link"
                exact-active-class="active"
            >
                {{ category.title }}
            </nuxt-link>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            default: () => ([]),
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/nav-categories";
</style>

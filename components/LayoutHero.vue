<template>
    <div
        class="layout-hero"
        v-html="html/* eslint-disable-line vue/no-v-html */"
    />
</template>

<script>
export default {
    props: {
        html: {
            type: String,
            default: '',
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/layout-hero";
</style>

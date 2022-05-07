<template>
    <div
        class="spinner-border"
        :class="{
            [`spinner-border-${size}`]: size
        }"
        role="status"
    >
        <span class="sr-only" v-text="'Loading...'" />
    </div>
</template>

<script>
export default {
    props: {
        size: {
            type: [Boolean, String],
            default: false,
        },
    },
};
</script>

<style lang="scss">
@import "../assets/scss/required";
@import "~bootstrap/scss/spinners";
</style>

<template>
    <div
        :class="`alert alert-${variant}`"
        role="alert"
    >
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        variant: {
            type: String,
            default: 'secondary',
        },
    },
};
</script>

<style lang="scss">
@use "../assets/scss/required" as *;
@import "bootstrap/scss/alert";
</style>

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
@import "../assets/scss/required";
@import "~bootstrap/scss/alert";
</style>

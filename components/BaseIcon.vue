<template>
    <span
        class="icon"
        :class="`icon-${name}`"
    >
        <svg-icon
            :name="name"
        />
    </span>
</template>

<script>
export default {
    name: 'BaseIcon',

    props: {
        name: {
            type: String,
            required: true
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/app-component.scss";

.icon {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    line-height: 0; // keep this square if children is text
    margin-top: -3px; // TODO: find a way to remove fixed px

    &::before {
        display: block;
        content: "";
        padding-top: 100%;
    }
    svg {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 1;
        width: 100%;
        height: 100%;
        transform: translate(-50%, -50%);

        use {
            pointer-events: none;
        }
    }

    // sizes
    width: 1.2rem;
    &.icon-sm {
        width: 1rem;
        font-size: $font-size-sm;
    }
    &.icon-lg {
        width: 1.75rem;
        font-size: $font-size-base;
    }
    &.icon-xl {
        width: 2.5rem;
        font-size: $font-size-lg;
    }

    // shapes
    &.icon-circle {
        border-radius: 50%;
        border: $border-width solid $border-color;

        svg {
            width: 75%;
            height: 75%;
        }
    }
}
</style>

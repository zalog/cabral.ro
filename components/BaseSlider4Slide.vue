<template>
    <div
        class="slider-item"
        :class="[
            colClass,
            { 'active': active }
        ]"
    >
        <slot v-if="$slots.default" />
    </div>
</template>

<script>
export default {
    name: 'BaseSlider4Slide',

    props: {
        colClass: {
            type: String,
            default: 'col-auto',
        },
        active: {
            type: Boolean,
            default: false,
        },
    },
};
</script>

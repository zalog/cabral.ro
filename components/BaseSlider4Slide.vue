<template>
    <div
        class="slider-item"
        :class="colClass"
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
    },
};
</script>

<template>
    <div class="slider-item">
        <slot v-if="$slots.default" />
    </div>
</template>

<script>
export default {
    name: 'BaseSlider4Slide',
};
</script>

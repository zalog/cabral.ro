<template functional>
    <div
        class="slider-item"
        :class="`${data.staticClass || 'col-auto'}`"
    >
        <slot v-if="$slots.default" />
    </div>
</template>

<script>
export default {
    name: 'BaseSlider4Slide',
};
</script>

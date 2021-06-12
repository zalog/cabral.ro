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

<style lang="scss" scoped>
.slider-item {
    flex: 0 0 auto;
    height: 100%;
    scroll-snap-align: start;
    background: #adb5bd;

    a {
        display: block;
    }
}
</style>

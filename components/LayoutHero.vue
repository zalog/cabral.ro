<template>
    <div class="layout-hero">
        <img
            :src="img.src"
            :srcset="img.srcset"
            :sizes="img.sizes"
            :width="img.width"
            :height="img.height"
            :alt="img.alt"
        >
    </div>
</template>

<script>
export default {
    props: {
        img: {
            type: [Boolean, Object],
            default: false,
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/layout-hero";
</style>

<template>
    <div class="relative -z-1 h-[65vh] overflow-hidden bg-black">
        <img
            class="absolute top-1/2 left-1/2 h-auto max-h-none min-h-full w-auto max-w-none min-w-full -translate-1/2"
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

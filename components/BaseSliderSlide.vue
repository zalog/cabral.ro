<template>
    <div
        class="slider-item"
        :class="[
            colClass,
            { 'active': getActive }
        ]"
    >
        <slot v-if="$slots.default" />
    </div>
</template>

<script>
export default {
    name: 'BaseSliderSlide',

    props: {
        colClass: {
            type: String,
            default: 'col-auto',
        },
        active: {
            type: Boolean,
            default: null,
        },
    },

    computed: {
        getActive() {
            const childrenActive = this.active;
            const parentActive = this.$parent.active;
            const childrenIndex = Number(this.$vnode.key);

            return childrenActive !== null
                ? childrenActive
                : parentActive === childrenIndex;
        },
    },
};
</script>

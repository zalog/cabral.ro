<template>
    <div
        v-if="visible"
        class="toast show"
        :class="[
            { [`toast-${variant}`]: variant },
            toastClass,
        ]"
    >
        <div class="toast-body">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    model: {
        prop: 'visible',
        event: 'hidden',
    },

    props: {
        visible: {
            type: Boolean,
            default: true,
        },
        variant: {
            type: String,
            default: undefined,
            validator: (value) => [undefined, 'secondary', 'success', 'danger'].includes(value),
        },
        toastClass: {
            type: String,
            default: null,
        },
        noAutoHide: {
            type: Boolean,
            default: false,
        },
    },

    destroyed() {
        this.$emit('destroyed', this.$vnode.key);
    },

    mounted() {
        if (!this.noAutoHide) this.attachAutoHide();
    },

    methods: {
        attachAutoHide() {
            setTimeout(() => {
                this.$destroy();
                this.$el.parentNode.removeChild(this.$el);
            }, 5000);
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/toast";
</style>

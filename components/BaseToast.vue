<template>
    <div
        v-if="visible"
        class="toast show"
        :class="[
            { [`text-bg-${variant}`]: variant },
            toastClass,
        ]"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
    >
        <div class="toast-body">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
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

    emits: ['hidden'],

    mounted() {
        if (!this.noAutoHide) this.attachAutoHide();
    },

    methods: {
        attachAutoHide() {
            setTimeout(() => {
                this.$emit('hidden');
            }, 5000);
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/toast";
</style>

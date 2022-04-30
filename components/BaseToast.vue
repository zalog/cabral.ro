<template>
    <b-toast
        v-model="computedVisible"
        :variant="variant"
        toaster="b-toaster-bottom-left"
        :toast-class="toastClass"
        no-close-button
        :no-auto-hide="noAutoHide"
        @hide="$emit('hide')"
    >
        <slot />
    </b-toast>
</template>

<script>
import { BToast } from 'bootstrap-vue';

export default {
    components: {
        'b-toast': BToast,
    },

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
            default: 'default',
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

    computed: {
        computedVisible: {
            get() { return this.visible; },
            set(value) { return this.$emit('hidden', value); },
        },
    },
};
</script>

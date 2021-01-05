<template>
    <b-toast
        v-model="computedVisible"
        toaster="b-toaster-bottom-left"
        no-close-button
        @hide="$emit('hide')"
    >
        <slot></slot>
    </b-toast>
</template>

<script>
import { BToast } from 'bootstrap-vue';

export default {
    components: {
        'b-toast': BToast
    },

    model: {
        prop: 'visible',
        event: 'hidden'
    },

    props: {
        visible: {
            type: Boolean,
            default: true
        }
    },

    computed: {
        computedVisible: {
            get() { return this.visible; },
            set(value) { return this.$emit('hidden', value); }
        }
    }
};
</script>

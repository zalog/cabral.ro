<template>
    <div
        v-if="visible"
        class="pointer-events-auto w-[350px] max-w-full rounded-md bg-clip-padding text-sm shadow-md"
        :class="variantClass"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
    >
        <div class="p-3 break-words">
            <slot />
        </div>
    </div>
</template>

<script>
const variants = {
    default: 'bg-black text-gray-300',
    secondary: 'bg-secondary text-white',
    success: 'bg-success text-white',
    danger: 'bg-danger text-white',
};

export default {
    props: {
        visible: {
            type: Boolean,
            default: true,
        },
        variant: {
            type: String,
            default: 'default',
            validator: (value) => Object.keys(variants).includes(value),
        },
        noAutoHide: {
            type: Boolean,
            default: false,
        },
    },

    emits: ['hidden'],

    computed: {
        variantClass() {
            return variants[this.variant];
        },
    },

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

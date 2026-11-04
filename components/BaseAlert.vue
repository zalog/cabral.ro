<template>
    <div
        class="relative rounded-md border p-4"
        :class="variantClass"
        role="alert"
    >
        <slot />
    </div>
</template>

<script>
const variants = {
    secondary: 'border-secondary-100 bg-secondary-50 text-secondary-800',
    danger: 'border-danger-100 bg-danger-50 text-danger-800',
};

export default {
    props: {
        variant: {
            type: String,
            default: 'secondary',
            validator: (value) => Object.keys(variants).includes(value),
        },
    },

    computed: {
        variantClass() {
            return variants[this.variant];
        },
    },
};
</script>

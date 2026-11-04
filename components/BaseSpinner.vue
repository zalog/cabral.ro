<template>
    <div
        class="inline-block animate-spin rounded-full border-current border-r-transparent align-[-.125em]"
        :class="sizeClass"
        role="status"
    >
        <span
            class="sr-only"
            v-text="'Loading...'"
        />
    </div>
</template>

<script>
const sizes = {
    sm: 'size-4 border-[.2em]',
    md: 'size-8 border-[.25em]',
};

export default {
    props: {
        size: {
            type: String,
            default: 'md',
            validator: (value) => Object.keys(sizes).includes(value),
        },
    },

    computed: {
        sizeClass() {
            return sizes[this.size];
        },
    },
};
</script>

<template>
    <span
        class="relative mt-[-3px] inline-flex aspect-square items-center justify-center align-middle leading-0"
        :class="sizeClass"
    >
        <svg
            class="absolute top-1/2 left-1/2 z-1 size-full -translate-1/2 fill-current"
            aria-hidden="true"
        >
            <use
                :href="href"
                class="pointer-events-none"
            />
        </svg>
    </span>
</template>

<script>
import sprite from '~/assets/icons/sprite.svg';

const sizes = {
    sm: 'w-4',
    md: 'w-[1.2rem]',
};

export default {
    props: {
        name: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            default: 'md',
            validator: (value) => Object.keys(sizes).includes(value),
        },
    },
    computed: {
        href() {
            return `${sprite}#${this.name}`;
        },
        sizeClass() {
            return sizes[this.size];
        },
    },
};
</script>

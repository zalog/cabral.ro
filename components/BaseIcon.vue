<template>
    <span
        class="icon"
        :class="`icon-${name}`"
    >
        <svg>
            <use :href="href" />
        </svg>
    </span>
</template>

<script>
import sprite from '~/assets/icons/sprite.svg';

export default {
    props: {
        name: {
            type: String,
            required: true,
        },
    },
    computed: {
        href() {
            return `${sprite}#${this.name}`;
        },
    },
};
</script>

<style lang="scss">
@use "~/assets/scss/05-components/base-icon";
</style>

<template>
    <span
        class="icon"
        :class="`icon-${name}`"
    >
        <svg-icon
            :name="name"
        />
    </span>
</template>

<script>
export default {
    name: 'BaseIcon',

    props: {
        name: {
            type: String,
            required: true,
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/base-icon";
</style>

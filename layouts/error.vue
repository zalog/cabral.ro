<template>
    <div>
        <h1>
            <template v-if="error.statusCode === 404">
                {{ error.message || 'Page not found' }}
            </template>
            <template v-else>
                An error occurred
            </template>
        </h1>
        <p>
            Go to
            <nuxt-link to="/">
                home page
            </nuxt-link>
        </p>
    </div>
</template>

<script>
export default {
    layout: 'empty',

    props: {
        error: {
            type: Object,
            required: true,
        },
    },
};
</script>

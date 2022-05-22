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
            You can go to
            <nuxt-link to="/" class="btn btn-outline-secondary">
                home page
            </nuxt-link>
            or
            <nuxt-link to="/contact/" class="btn btn-outline-secondary">
                contact
            </nuxt-link>
            now.
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

<template>
    <nuxt-layout name="empty">
        <div class="page">
            <h1>
                <template v-if="error.statusCode === 404">
                    {{ error.message || 'Nu am găsit pagina' }}
                </template>
                <template v-else>
                    A apărut o eroare
                </template>
            </h1>
            <p>
                Acum poți naviga către
                <nuxt-link
                    to="/"
                    class="btn btn-outline-secondary"
                >
                    home page
                </nuxt-link>
                sau pagina de
                <nuxt-link
                    to="/contact/"
                    class="btn btn-outline-secondary"
                >
                    contact
                </nuxt-link>
            </p>
        </div>
    </nuxt-layout>
</template>

<script>
export default {
    props: {
        error: {
            type: Object,
            required: true,
        },
    },
};
</script>

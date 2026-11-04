<template>
    <nuxt-layout name="empty">
        <div class="mx-auto w-full max-w-160">
            <h1 class="mb-12">
                <template v-if="error.statusCode === 404">
                    {{ error.message || 'Nu am găsit pagina' }}
                </template>
                <template v-else>
                    A apărut o eroare
                </template>
            </h1>
            <p class="mb-12">
                Acum poți naviga către
                <nuxt-link
                    to="/"
                    class="inline-block rounded-md border border-secondary px-3 py-1.5 text-center align-middle text-secondary no-underline transition-[color,background-color,border-color,box-shadow] duration-150 ease-in-out select-none hover:bg-secondary hover:text-white focus-visible:ring-4 focus-visible:ring-secondary/50 focus-visible:outline-none"
                >
                    home page
                </nuxt-link>
                sau pagina de
                <nuxt-link
                    to="/contact/"
                    class="inline-block rounded-md border border-secondary px-3 py-1.5 text-center align-middle text-secondary no-underline transition-[color,background-color,border-color,box-shadow] duration-150 ease-in-out select-none hover:bg-secondary hover:text-white focus-visible:ring-4 focus-visible:ring-secondary/50 focus-visible:outline-none"
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

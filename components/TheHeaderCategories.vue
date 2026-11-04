<template>
    <ul class="scrollbar-none flex gap-4 overflow-x-auto p-3">
        <li
            v-for="(category, index) in data"
            :key="`navbar-categories-${index}`"
            class="inline-block flex-[1_0_auto] text-center"
        >
            <nuxt-link
                :to="category.to"
                class="block rounded-md border border-gray-200 bg-[#eceff2] px-2 py-1 text-gray-900/65 no-underline transition-colors duration-150 ease-in-out hover:border-[#bdc6d0] hover:bg-[#e0e5e9] aria-[current=page]:border-[#bdc6d0] aria-[current=page]:bg-[#e0e5e9] md:px-4 md:py-2"
            >
                {{ category.title }}
            </nuxt-link>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            default: () => ([]),
        },
    },
};
</script>

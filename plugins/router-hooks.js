import { computed } from 'vue';
import { defineNuxtPlugin, useHead, useRoute } from '#imports';

export default defineNuxtPlugin(() => {
    const route = useRoute();

    useHead({
        bodyAttrs: {
            class: computed(() => `body-${route.meta.class || route.name.toLowerCase()}`),
        },
    });
});

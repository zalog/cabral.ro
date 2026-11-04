<template>
    <div class="relative flex min-w-0 flex-col rounded-lg bg-white wrap-break-word shadow-lg">
        <div
            v-if="img"
            class="relative overflow-hidden rounded-t-lg"
        >
            <div class="relative aspect-video overflow-hidden">
                <img
                    :loading="imgLoading"
                    :src="img.src"
                    :srcset="img.srcset"
                    :sizes="img.sizes"
                    :width="img.width"
                    :height="img.height"
                    :alt="img.alt"
                    class="absolute top-1/2 left-1/2 h-auto w-full -translate-1/2"
                >
            </div>
            <list-item-info
                :data="imgInfo"
                badges
                class="absolute top-4 right-4"
            />
        </div>
        <div class="flex-auto space-y-4 p-4">
            <h2>
                <router-link
                    :to="postTo(slug)"
                    class="text-inherit after:absolute after:inset-0 after:z-1"
                >
                    <span v-html="title /* eslint-disable-line vue/no-v-html */" />
                </router-link>
            </h2>
            <list-item-info
                :data="bodyInfo"
                class="-mt-2 [&_a]:relative [&_a]:z-2"
            />
            <div
                v-if="bodyText"
                class="wp-content *:last:mb-0 [&>p_a]:hidden"
                v-html="bodyText/* eslint-disable-line vue/no-v-html */"
            />
        </div>
    </div>
</template>

<script>
import ListItemInfo from '~/components/ListItemInfo.vue';

export default {
    components: {
        ListItemInfo,
    },

    props: {
        img: {
            type: [Boolean, Object],
            default: false,
        },
        imgLoading: {
            type: String,
            default: 'lazy',
        },
        imgInfo: {
            type: Array,
            default: () => ([]),
        },
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        bodyInfo: {
            type: Array,
            default: () => ([]),
        },
        bodyText: {
            type: String,
            default: '',
        },
    },

    methods: {
        postTo(slug) {
            return {
                name: 'Single',
                params: {
                    singleSlug: slug,
                },
            };
        },
    },
};
</script>

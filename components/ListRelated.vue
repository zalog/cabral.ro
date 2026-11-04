<template>
    <div class="ml-[50%] w-screen -translate-x-1/2 bg-gray-100 p-4 lg:p-12">
        <div class="space-y-4">
            <h3 class="text-2xl/[1.2]">
                Pe aceeași temă
            </h3>

            <div class="grid gap-4 sm:grid-cols-3 sm:gap-6 [&_h2]:text-base/[1.2]">
                <base-item-post
                    v-for="(post, index) in data"
                    :key="`related-${index}`"
                    :img="post.featuredMedia"
                    :title="post.title"
                    :slug="post.slug"
                    :body-text="post.excerpt"
                />
            </div>
        </div>
    </div>
</template>

<script>
import BaseItemPost from './BaseItemPost.vue';

export default {
    components: {
        BaseItemPost,
    },

    props: {
        data: {
            type: Array,
            required: true,
        },
    },
};
</script>

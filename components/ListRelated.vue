<template>
    <div class="w-100vw p-3 p-lg-5 bg-light">
        <div class="box">
            <h3 class="box-title">
                Pe aceeași temă
            </h3>

            <div class="box-body">
                <div class="row row-related">
                    <div
                        v-for="(post, index) in data"
                        :key="`related-${index}`"
                        class="col-sm-4 mb-3 mb-sm-0"
                    >
                        <base-item-post
                            :img="post.featuredMedia"
                            :title="post.title"
                            :slug="post.slug"
                            :body-text="post.excerpt"
                        />
                    </div>
                </div>
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

<style lang="scss">
@import "~/assets/scss/05-components/list-related";
</style>

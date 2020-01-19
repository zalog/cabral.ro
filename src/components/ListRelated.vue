<template>
    <div>
        <h3>Pe aceeași temă</h3>

        <div class="row row-related">
            <div
                v-for="(post, index) in data" :key="`related-${index}`"
                class="col-sm-4 mb-3 mb-sm-0"
            >
                <base-item-post
                    :post="post"
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
    name: 'ListRelated',

    components: {
        BaseItemPost
    },

    props: {
        data: {
            type: Array,
            required: true
        }
    },

    methods: {
        postTo: (slug) => ({
            name: 'single',
            params: {
                singleSlug: slug,
                singleType: 'post'
            }
        })
    }
};
</script>

<style lang="scss" scoped>
@import "./../scss/app-component.scss";
@import "~bootstrap/scss/card";

.row-related {
    > div > div {
        height: 100%;
    }

    /deep/ {
        .card-title {
            font-size: $font-size-base;
        }
    }
}
</style>

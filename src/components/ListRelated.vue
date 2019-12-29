<template>
    <ul class="list-related">
        <router-link
            tag="li"
            v-for="(post, index) in data" :key="`related-${index}`"
            :to="postTo(post.slug)"
        >
            <div class="card">
                <div class="card-img-top">
                    <img :src="post.img" />
                </div>
                <div class="card-body">
                    <h4 class="cart-title">
                        <router-link :to="postTo(post.slug)">
                            {{ post.title }}
                        </router-link>
                    </h4>
                </div>
            </div>
        </router-link>
    </ul>
</template>

<script>
export default {
    name: 'ListRelated',

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

.list-related {
    @include list-unstyled;
    display: flex;
    flex-wrap: wrap;

    li {
        flex: 1;
    }
}

.card-img-top {
    position: relative;
    padding-top: percentage(9/16);
    overflow: hidden;

    img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: auto;
    }
}

.cart-title {
    margin-bottom: 0;
    font-size: $font-size-base;

    &,
    a {
        color: $body-color;
    }
}
</style>

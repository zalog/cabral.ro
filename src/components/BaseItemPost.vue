<template>
    <router-link
        tag="div"
        class="card"
        v-ripple
        :to="postTo(post.slug)"
    >
        <div
            v-if="post.featuredMedia"
            class="card-img-top"
        >
            <div class="img" v-html="post.featuredMedia" />
            <list-item-info
                :data="[{
                    icon: 'comment',
                    text: post.commentsNumber
                }]"
            />
        </div>
        <div class="card-body" :to="postTo(post.slug)">
            <h2 class="card-title">
                <router-link v-html="post.title" :to="postTo(post.slug)" />
            </h2>
            <list-item-info
                :data="[{
                    icon: 'date',
                    text: $options.filters.formatDate(post.date)
                }, {
                    icon: 'folder',
                    links: post.categories
                }]"
            />
            <div class="card-text" v-html="post.excerpt" />
        </div>
    </router-link>
</template>

<script>
import ListItemInfo from './ListItemInfo.vue';

export default {
    name: 'BaseItemPost',

    components: {
        ListItemInfo
    },

    props: {
        post: {
            type: Object,
            required: true
        }
    },

    methods: {
        postTo(slug) {
            return {
                name: 'single',
                params: {
                    singleSlug: slug,
                    singleType: 'post'
                }
            };
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./../scss/app-component.scss";

$card-border-radius:          $border-radius-lg;
$card-border-color:           transparent;

@import "~bootstrap/scss/card";

.img {
    position: relative;
    padding-top: percentage(9/16);
    overflow: hidden;

    /deep/ {
        img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: auto;
        }
    }
}

.card-text {
    /deep/ {
        > p a {
            display: none;
        }

        > *:last-child {
            margin-bottom: 0;
        }
    }
}

.card {
    cursor: pointer;
    box-shadow: $box-shadow-lg;
    border: 0;

    .card-img-top {
        position: relative;
        overflow: hidden;

        .list-item-info {
            position: absolute;
            top: $spacer;
            right: $spacer;

            /deep/ {
                .icon {
                    width: 1rem;
                }

                li {
                    padding: $badge-padding-y * 1.8 $badge-padding-x * 2;
                    font-size: $badge-font-size;
                    border-radius: $badge-border-radius;
                    background-color: rgba($white, .6);
                    color: $gray-800;
                }
            }
        }
    }
    .card-body {
        .card-title > a {
            color: $body-color;
        }
        .list-item-info {
            margin-top: -(map-get($spacers, 2));
        }
    }
}
</style>

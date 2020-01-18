<template>
    <router-link
        :tag="tag"
        class="card"
        v-ripple
        :to="postTo(slug)"
    >
        <div
            v-if="img"
            class="card-img-top"
        >
            <div
                v-if="typeof img === 'string'"
                v-html="img"
                class="img"
            />
            <img
                v-else-if="typeof img ==='object'"
                :src="img.src"
            />
            <list-item-info
                :data="imgInfo"
            />
        </div>
        <div class="card-body" :to="postTo(slug)">
            <h2 class="card-title">
                <router-link v-html="title" :to="postTo(slug)" />
            </h2>
            <list-item-info
                :data="bodyInfo"
            />
            <div
                v-if="bodyText"
                v-html="bodyText"
                class="card-text"
            />
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
        tag: {
            type: String,
            default: 'div'
        },
        img: [String, Object],
        imgInfo: Array,
        title: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        bodyInfo: Array,
        bodyText: String
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

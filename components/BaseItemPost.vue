<template>
    <router-link
        :tag="tag"
        class="card"
        :to="postTo(slug)"
    >
        <div
            v-if="img"
            class="card-img-top"
        >
            <div class="img" v-html="img/* eslint-disable-line vue/no-v-html */" />
            <list-item-info
                :data="imgInfo"
            />
        </div>
        <div class="card-body" :to="postTo(slug)">
            <h2 class="card-title">
                <router-link :to="postTo(slug)">
                    {{ title }}
                </router-link>
            </h2>
            <list-item-info
                :data="bodyInfo"
            />
            <div
                v-if="bodyText"
                class="card-text"
                v-html="bodyText/* eslint-disable-line vue/no-v-html */"
            />
        </div>
    </router-link>
</template>

<script>
import ListItemInfo from '~/components/ListItemInfo.vue';

export default {
    name: 'BaseItemPost',

    components: {
        ListItemInfo,
    },

    props: {
        tag: {
            type: String,
            default: 'div',
        },
        img: {
            type: [String, Object],
            default: '',
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
                    singleType: 'post',
                },
            };
        },
    },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/app-component.scss";

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
            width: 100%;
            height: auto;
            transform: translate(-50%, -50%);
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
    border: 0;
    box-shadow: $box-shadow-lg;
    cursor: pointer;

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
                    color: $gray-800;
                    font-size: $badge-font-size;
                    background-color: rgba($white, .6);
                    border-radius: $badge-border-radius;
                }
            }
        }
    }

    .card-body {
        > * {
            margin-bottom: $spacer;

            &:last-child {
                margin-bottom: 0;
            }
        }

        .card-title > a {
            color: $body-color;
        }

        .list-item-info {
            margin-top: -(map-get($spacers, 2));
        }
    }
}
</style>

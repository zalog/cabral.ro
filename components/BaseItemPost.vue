<template>
    <router-link
        tag="div"
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
    components: {
        ListItemInfo,
    },

    props: {
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

<style lang="scss">
@import "~/assets/scss/05-components/base-item-post";
</style>

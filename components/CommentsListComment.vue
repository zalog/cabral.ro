<template>
    <div class="comment">
        <div class="comment-header">
            <template v-if="comment.author.node">
                <template v-if="!comment.author.node.url">
                    {{ comment.author.node.name }}
                </template>
                <a
                    v-else
                    :href="comment.author.node.url"
                    target="_blank"
                    rel="external nofollow ugc"
                >
                    {{ comment.author.node.name }}
                </a>
            </template>
            <list-item-info
                :data="[{
                    icon: 'date',
                    text: $options.filters.formatDate(comment.date)
                }]"
            />
        </div>
        <div
            class="comment-content"
            v-html="comment.content/* eslint-disable-line vue/no-v-html */"
        />
    </div>
</template>

<script>
import ListItemInfo from './ListItemInfo.vue';

export default {
    name: 'CommentsListComment',

    components: {
        ListItemInfo,
    },

    props: {
        comment: {
            type: Object,
            required: true,
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/comments-list-comment";
</style>

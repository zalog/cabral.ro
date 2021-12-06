<template>
    <div class="comment">
        <div class="comment-header">
            <div v-html="printAuthor(comment)/* eslint-disable-line vue/no-v-html */" />
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

    methods: {
        printAuthor(comment) {
            let output = comment.author.node.name;
            if (comment.author.node.url) output = `<a href="${comment.author.node.url}" target="_blank">${output}</a>`;

            return output;
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/comments-list-comment";
</style>

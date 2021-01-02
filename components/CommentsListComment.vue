<template>
    <div class="comment">
        <div class="comment-header">
            <div v-html="printAuthor(comment)" />
            <list-item-info
                :data="[{
                    icon: 'date',
                    text: $options.filters.formatDate(comment.date)
                }]"
            />
        </div>
        <div
            class="comment-content"
            v-html="comment.content"
        />
    </div>
</template>

<script>
import ListItemInfo from './ListItemInfo.vue';

export default {
    name: 'CommentsListComment',

    components: {
        ListItemInfo
    },

    props: {
        comment: {
            type: Object,
            required: true
        }
    },

    methods: {
        printAuthor(comment) {
            let output = comment.author.name;
            if (comment.author.url) output = `<a href="${comment.author.url}" target="_blank">${output}</a>`;

            return output;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/app-component.scss";

.comment {
    color: $gray-700;

    /deep/ {
        a {
            color: $gray-700;
        }
    }
}

.comment-header {
    margin-bottom: $spacer;

    div:first-child {
        margin-bottom: map-get($spacers, 1);
        font-weight: bold;
    }
}

.comment-content {
    /deep/ {
        p {
            word-wrap: break-word;
        }

        > p:last-child {
            margin-bottom: 0;
        }
    }
}
</style>

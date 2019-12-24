<template>
    <div class="comment">
        <div class="comment-header">
            <div v-html="printAuthor(comment)" />
            <div>
                <base-icon name="date" />
                {{ comment.date | formatDate }}
            </div>
        </div>
        <div
            class="comment-content"
            v-html="comment.content"
        />
    </div>
</template>

<script>
import './../utils/filters/formatDate';

export default {
    name: 'CommentsListComment',

    props: {
        comment: {
            type: Object
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
@import "./../scss/app-component.scss";

.comment {
    color: $gray-700;

    /deep/ {
        a {
            color: $gray-700;
        }
    }
}

.comment-header {
    div:first-child {
        font-weight: bold;
    }
    div:last-child {
        font-size: $font-size-sm;
        color: $gray-600;
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

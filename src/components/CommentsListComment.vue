<template>
    <div class="comment">
        <div class="comment-header">
            <div v-html="printAuthor(comment)" />
            <ul class="list-item-info">
                <li>
                    <base-icon name="date" />
                    {{ comment.date | formatDate }}
                </li>
            </ul>
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

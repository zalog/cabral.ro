<template>
    <div>
        <h3>Comentarii</h3>

        <comments-list-form :data="{ singleId }" />

        <ul class="list-comments">
            <li
                v-for="(comment, index) in comments && comments.nodes"
                :id="`comment-${comment.commentId}`"
                :key="'comments-comment-' + comment.commentId"
            >
                <comments-list-comment
                    v-observe-visibility="{
                        callback: isVisible => emitVisibleLastComment(isVisible, index + 1),
                        once: true
                    }"
                    :comment="comment"
                />

                <ul v-if="comment.replies && comment.replies.nodes.length">
                    <li
                        v-for="commentReply in comment.replies.nodes"
                        :id="`comment-${commentReply.commentId}`"
                        :key="'comments-comment-l1-' + commentReply.commentId"
                    >
                        <comments-list-comment
                            :comment="commentReply"
                        />
                    </li>
                </ul>

                <comments-list-form
                    :data="{
                        label: 'răspunde...',
                        singleId,
                        commentId: comment.commentId,
                        index
                    }"
                />
            </li>
            <li
                v-if="loading"
                class="py-4 text-center"
            >
                <b-spinner variant="warning" label="Loading..." />
            </li>
        </ul>
    </div>
</template>

<script>
import { BSpinner } from 'bootstrap-vue';
import CommentsListComment from './CommentsListComment.vue';
import CommentsListForm from './CommentsListForm.vue';

export default {
    name: 'CommentsList',

    components: {
        BSpinner,
        CommentsListComment,
        CommentsListForm,
    },

    props: {
        loading: Boolean,
        comments: Object,
        singleId: Number,
    },

    methods: {
        emitVisibleLastComment(isVisible, index) {
            if (!isVisible || this.comments.nodes.length !== index) return;

            this.$emit('is-visible-last');
        },
    },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/app-component.scss";

.list-comments {
    &,
    ul {
        @include list-unstyled;
    }

    .comment {
        padding: map-get($spacers, 4);
    }

    > li {
        margin-top: map-get($spacers, 4);
        background-color: $white;
        box-shadow: $box-shadow-sm;

        * + * {
            border-top: $border-width solid $border-color;
        }
    }
}
</style>

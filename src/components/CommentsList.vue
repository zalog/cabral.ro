<template>
    <div>
        <comments-list-form :data="{singleId: data.single.id}" />

        <ul class="list-comments">
            <li
                v-for="(comment, index) in data.comments.data" :key="'comments-comment-' + comment.commentId"
                :id="`comment-${comment.commentId}`"
            >
                <comments-list-comment :comment="comment" />

                <ul v-if="comment.replies && comment.replies.nodes.length">
                    <li
                        v-for="comment in comment.replies.nodes" :key="'comments-comment-l1-' + comment.commentId"
                        :id="`comment-${comment.commentId}`"
                    >
                        <comments-list-comment :comment="comment" />
                    </li>
                </ul>

                <comments-list-form
                    :data="{
                        label: 'răspunde...',
                        singleId: data.single.id,
                        commentId: comment.commentId,
                        index
                    }"
                />
            </li>
            <li
                v-if="data.comments.loading === true"
                class="py-4 text-center"
            >
                <b-spinner variant="warning" label="Loading..."></b-spinner>
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
        CommentsListForm
    },

    computed: {
        data() {
            return this.$store.getters['data/currentPage'];
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./../scss/app-component.scss";

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

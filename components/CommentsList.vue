<template>
    <div>
        <h3>Comentarii</h3>

        <comments-list-form :data="{singleId: data.main.single.id}" />

        <ul class="list-comments">
            <li
                v-for="(comment, index) in data.comments && data.comments.nodes" :key="'comments-comment-' + comment.commentId"
                :id="`comment-${comment.commentId}`"
            >
                <comments-list-comment
                    :comment="comment"
                    v-observe-visibility="{
                        callback: isVisible => emitVisibleLastComment(isVisible, index + 1),
                        once: true
                    }"
                />

                <ul v-if="comment.replies && comment.replies.nodes.length">
                    <li
                        v-for="comment in comment.replies.nodes" :key="'comments-comment-l1-' + comment.commentId"
                        :id="`comment-${comment.commentId}`"
                    >
                        <comments-list-comment
                            :comment="comment"
                        />
                    </li>
                </ul>

                <comments-list-form
                    :data="{
                        label: 'răspunde...',
                        singleId: data.main.single.id,
                        commentId: comment.commentId,
                        index
                    }"
                />
            </li>
            <li
                v-if="this.loading"
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

    props: {
        loading: Boolean
    },

    computed: {
        data() {
            return this.$store.getters['data/currentPage'](this.$route.fullPath);
        }
    },

    methods: {
        emitVisibleLastComment(isVisible, index) {
            if (!isVisible || this.data.comments.nodes.length != index) return;

            this.$emit('is-visible-last');
        }
    }
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

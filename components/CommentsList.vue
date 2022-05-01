<template>
    <div class="box">
        <h3 class="box-title">
            Comentarii
        </h3>

        <comments-list-form :data="{ singleId }" />

        <ul class="list-comments">
            <li>
                <div class="comment">
                    <div class="comment-header d-flex justify-content-between">
                        <a href="https://zalog.ro/" target="_blank" rel="external noopener">Catalin Zălog</a>
                        <div class="small">
                            publicitate
                        </div>
                    </div>
                    <div class="comment-content">
                        <p>
                            Colaborez cu cabral de prin 2014. Îmi place pentru că apreciază <a href="https://zalog.ro/" title="web development" target="_blank" rel="external noopener">serviciile mele</a>.
                        </p>
                    </div>
                </div>
            </li>
            <li
                v-for="(comment, index) in comments && comments.nodes"
                :id="`comment-${comment.databaseId}`"
                :key="'comments-comment-' + comment.databaseId"
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
                        :id="`comment-${commentReply.databaseId}`"
                        :key="'comments-comment-l1-' + commentReply.databaseId"
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
                        commentId: comment.databaseId,
                        index
                    }"
                />
            </li>
            <li class="py-4 text-center">
                <b-spinner variant="secondary" label="Loading..." />
            </li>
        </ul>
    </div>
</template>

<script>
import { ObserveVisibility } from 'vue-observe-visibility';
import { BSpinner } from 'bootstrap-vue';
import CommentsListComment from './CommentsListComment.vue';
import CommentsListForm from './CommentsListForm.vue';

export default {
    components: {
        BSpinner,
        CommentsListComment,
        CommentsListForm,
    },

    directives: {
        ObserveVisibility,
    },

    props: {
        comments: {
            type: Object,
            default: () => ({}),
        },
        singleId: {
            type: Number,
            default: null,
        },
    },

    methods: {
        emitVisibleLastComment(isVisible, index) {
            if (!isVisible || this.comments.nodes.length !== index) return;

            this.$emit('is-visible-last');
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/comments-list";
</style>

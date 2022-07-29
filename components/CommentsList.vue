<template>
    <div class="box">
        <h3 class="box-title">
            {{ header.title }}
        </h3>
        <p v-if="header.subtitle">
            {{ header.subtitle }}
        </p>

        <comments-list-form
            v-if="singleCommentStatus === 'open'"
            :data="{ singleId }"
        />

        <ul
            v-if="!hideComments"
            class="list-comments"
        >
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
                    v-if="singleCommentStatus === 'open'"
                    :data="{
                        label: 'răspunde-i',
                        singleId,
                        commentId: comment.databaseId,
                        index
                    }"
                />
            </li>
            <li class="py-4 text-center">
                <base-spinner />
            </li>
        </ul>
    </div>
</template>

<script>
import BaseSpinner from './BaseSpinner.vue';
import CommentsListComment from './CommentsListComment.vue';
import CommentsListForm from './CommentsListForm.vue';

export default {
    components: {
        BaseSpinner,
        CommentsListComment,
        CommentsListForm,
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
        singleCommentStatus: {
            type: String, // 'open' || 'closed'
            default: null,
        },
        hideComments: {
            type: Boolean,
            default: false,
        },
    },

    created() {
        this.getHeader();
    },

    methods: {
        emitVisibleLastComment(isVisible, index) {
            if (!isVisible || this.comments.nodes.length !== index) return;

            this.$emit('is-visible-last');
        },
        getHeader() {
            const output = { title: 'Comentarii' };

            if (this.singleCommentStatus === 'closed') output.title = 'Comentariile au fost închise';
            else if (this.hideComments) {
                Object.assign(output, {
                    title: 'Comentariile sunt ascunse momentan',
                    subtitle: 'Dar tu poți adăuga oricând comentariul tău pentru concurs.',
                });
            }

            this.header = output;
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/comments-list";
</style>

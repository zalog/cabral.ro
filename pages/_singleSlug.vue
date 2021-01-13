<template>
    <div
        v-if="data"
        class="page-single"
    >
        <div
            v-if="data.main.featuredMedia"
            class="entry-img-hero"
            v-html="data.main.featuredMedia"
        />
        <div
            class="container-fluid"
        >
            <h1
                v-html="data.main.title"
                class="entry-title"
            />
            <list-item-info
                :data="[{
                    icon: 'date',
                    text: $options.filters.formatDate(data.main.date)
                }, {
                    icon: 'folder',
                    links: data.main.categories
                }, {
                    icon: 'comment',
                    text: data.main.commentsNumber
                }]"
            />
            <div
                ref="content"
                v-html="data.main.content"
                class="entry-content"
            />
            <list-share :url="data.main.link" />
        </div>

        <div class="bg-light">
            <template
                v-if="data.related"
            >
                <div class="container-fluid">
                    <list-related :data="data.related" />
                </div>

                <hr class="d-none d-lg-block" />
            </template>

            <div
                class="container-fluid"
                v-observe-visibility="!comments.shown ? isVisible => fetchComments(isVisible) : false"
            >
                <comments-list
                    :loading="comments.loading"
                    @is-visible-last="fetchComments(true)"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import dataSingle from '~/store/lazy/data-single';
import dataComments from './../store/lazy/data-single-comments';
import { currentPage } from '~/mixins';
import ListItemInfo from '~/components/ListItemInfo.vue';
import ListShare from '~/components/ListShare.vue';
import ListRelated from '~/components/ListRelated.vue';
import CommentsList from './../components/CommentsList';
import { ObserveVisibility } from 'vue-observe-visibility';

Vue.directive('observe-visibility', ObserveVisibility);

export default {
    components: {
        ListItemInfo,
        ListShare,
        ListRelated,
        CommentsList
    },

    mixins: [
        currentPage
    ],

    async asyncData({ store, route }) {
        store.registerModule(['data', 'dataSingle'], dataSingle, { preserveState: true });

        let actionName = 'data/fetchPageSingle';
        if (route.params.singleType === 'post') actionName = 'data/fetchPagePost';
        else if (route.params.singleType === 'page') actionName = 'data/fetchPagePage';

        await store.dispatch(actionName, {
            route
        });
    },

    data: () => ({
        comments: {
            shown: false,
            loading: false
        }
    }),

    beforeDestroy() {
        this.$store.unregisterModule(['data', 'dataSingle']);
        if (this.$store.hasModule(['data', 'dataComments'])) {
            this.$store.unregisterModule(['data', 'dataComments']);
        }
    },

    methods: {
        async fetchComments(isVisible) {
            if (!isVisible && !this.comments.loading) return;

            const hasNextPage = this.data.comments && this.data.comments.pageInfo && this.data.comments.pageInfo.hasNextPage;

            if (hasNextPage === false) return;

            this.comments.loading = true;
            this.comments.shown = true;

            if (!this.$store.hasModule(['data', 'dataComments'])) {
                this.$store.registerModule(['data', 'dataComments'], dataComments, { preserveState: true });
            }
            await this.$store.dispatch('data/fetchComments', {
                route: this.$route
            });

            this.comments.loading = false;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/app-component.scss";

.container-fluid {
    max-width: 800px;
    padding-top: $grid-gutter-width;
    padding-bottom: $grid-gutter-width;

    @include media-breakpoint-up(md) {
        padding: map-get($spacers, 5);
    }
}

.entry-img-hero {
    position: relative;
    z-index: -1;
    height: calc(100vh - 56px);
    margin-bottom: -40vh;
    overflow: hidden;
    background-color: $black;

    &::after {
        content: " ";
        position: absolute;
        width: 100%;
        height: 100%;
    }

    /deep/ {
        img {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translate(-50%, 0);
            min-width: 100%;
            height: auto;
        }
    }
}

.entry-img-hero + .container-fluid {
    background-color: $body-bg;
    border-top-left-radius: $border-radius-lg;
    border-top-right-radius: $border-radius-lg;

    @include media-breakpoint-up(md) {
        border-radius: 0;
    }
}

.entry-content {
    word-wrap: break-word;
}

/deep/ {
    @import "~bootstrap/scss/alert";
    @import "~/assets/scss/pages/single";
}
</style>

<template>
    <div v-if="data">
        <div
            v-if="data.main.featuredMedia"
            class="entry-img-hero"
            v-html="data.main.featuredMedia/* eslint-disable-line vue/no-v-html */"
        />
        <div class="entry-body">
            <h1
                class="entry-title"
            >
                {{ data.main.title }}
            </h1>
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
                class="entry-content"
                v-html="data.main.content/* eslint-disable-line vue/no-v-html */"
            />
            <list-share :url="data.main.link" />
            <template
                v-if="data.related"
            >
                <list-related :data="data.related" />

                <hr class="d-none d-lg-block">
            </template>
            <div
                v-observe-visibility="
                    !comments.shown
                        ? isVisible => fetchComments(isVisible, true)
                        : false
                "
            >
                <comments-list
                    :loading="comments.loading"
                    :comments="data.comments"
                    :single-id="data.main.id"
                    @is-visible-last="fetchComments(true)"
                />
            </div>
        </div>

        <lazy-photoswipe
            v-if="typeof photoswipe.index === 'number'"
            v-model="photoswipe.index"
            :items="photoswipe.items"
            @closed="onPhotoswipeClosed()"
            @update:index="onPhotoswipeUpdate($event)"
        />
    </div>
</template>

<script>
import Vue from 'vue';
import { ObserveVisibility } from 'vue-observe-visibility';
import dataSingle from '~/store/lazy/data-single';
import dataComments from '../store/lazy/data-single-comments';
import { currentPage } from '~/mixins';
import ListItemInfo from '~/components/ListItemInfo.vue';
import ListShare from '~/components/ListShare.vue';
import ListRelated from '~/components/ListRelated.vue';
import CommentsList from '~/components/CommentsList.vue';

Vue.directive('observe-visibility', ObserveVisibility);

export default {
    components: {
        ListItemInfo,
        ListShare,
        ListRelated,
        CommentsList,
    },

    mixins: [
        currentPage,
    ],

    async asyncData({ store, route }) {
        if (!store.hasModule(['data', 'dataSingle'])) {
            store.registerModule(['data', 'dataSingle'], dataSingle, { preserveState: true });
        }

        let actionName = 'data/fetchPageSingle';
        if (route.params.singleType === 'post') actionName = 'data/fetchPagePost';
        else if (route.params.singleType === 'page') actionName = 'data/fetchPagePage';

        await store.dispatch(actionName, {
            route,
        });
    },

    data: () => ({
        photoswipe: {
            index: false,
            items: [],
        },
        comments: {
            shown: false,
            loading: false,
        },
    }),

    head() {
        const bodyClass = this.data.main.featuredMedia && 'body-single-hero';

        if (!bodyClass) return null;

        return {
            bodyAttrs: {
                class: [bodyClass],
            },
        };
    },

    mounted() {
        this.setDataPhotoswipe();
    },

    beforeDestroy() {
        this.$store.unregisterModule(['data', 'dataSingle']);
        if (this.$store.hasModule(['data', 'dataComments'])) {
            this.$store.unregisterModule(['data', 'dataComments']);
        }
    },

    methods: {
        async fetchComments(isVisible, checkForData) {
            if (!isVisible && !this.comments.loading) return;

            if (checkForData && this.data.comments) return;

            const hasNextPage = this.data.comments
                && this.data.comments.pageInfo
                && this.data.comments.pageInfo.hasNextPage;

            if (hasNextPage === false) return;

            this.comments.loading = true;
            this.comments.shown = true;

            if (!this.$store.hasModule(['data', 'dataComments'])) {
                this.$store.registerModule(['data', 'dataComments'], dataComments, { preserveState: true });
            }
            await this.$store.dispatch('data/fetchComments', {
                route: this.$route,
            });

            this.comments.loading = false;
        },
        setDataPhotoswipe() {
            this.$refs.content.querySelectorAll('img').forEach((img, index) => {
                const src = (img.getAttribute('data-src') || img.getAttribute('data-orig-file')).split('?')[0];
                const size = (img.getAttribute('data-orig-size') || '0,0').split(',');

                this.photoswipe.items.push({
                    src,
                    w: size[0],
                    h: size[1],
                });

                img.addEventListener('click', (event) => {
                    event.preventDefault();

                    this.photoswipe.index = index;
                });
            });

            this.pageTitleInitial = this.pageTitle;

            const { hash } = this.$route;
            if (hash.includes('pid=')) {
                const index = hash.split('=')[1];
                this.photoswipe.index = Number(index);
            }
        },
        onPhotoswipeUpdate(itemIndex) {
            const route = this.$route;
            const itemNr = itemIndex + 1;
            const pageTitle = `${this.pageTitleInitial} - Image ${itemNr}`;

            this.$store.dispatch('data/setPageData', {
                route,
                prop: 'head.title',
                data: pageTitle,
            });
            this.sendPageView({
                title: pageTitle,
                url: route.fullPath,
            });
        },
        onPhotoswipeClosed() {
            this.photoswipe.index = false;

            this.$store.dispatch('data/setPageData', {
                route: this.$route,
                prop: 'head.title',
                data: this.pageTitleInitial,
            });
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/07-trumps/page-single";
</style>

<template>
    <div v-if="data">
        <div class="entry-body">
            <div class="entry-header">
                <h1>
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
            </div>
            <div
                ref="content"
                class="entry-content"
                v-html="data.main.content.rendered/* eslint-disable-line vue/no-v-html */"
            />
            <list-share
                class="scroll-x scroll-hide-bar"
                :url="data.main.link"
            />
            <list-related
                v-if="data.related"
                :data="data.related"
            />
            <banners v-if="data.main.categories">
                <a href="http://www.runningmag.ro/" target="_blank" title="runningmag.ro" rel="external nofollow noopener">
                    <img src="https://www.cabral.ro/ads/300x250-runningmag.ro-26012018.png" alt="runningmag.ro">
                </a>
            </banners>
            <comments-list
                ref="comments"
                :comments="data.comments"
                :single-id="data.main.id"
                @is-visible-last="fetchComments(true)"
            />
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
import dataSingle from '~/store/lazy/data-single';
import dataComments from '~/store/lazy/data-single-comments';
import { currentPage } from '~/mixins';
import ListItemInfo from '~/components/ListItemInfo.vue';
import ListShare from '~/components/ListShare.vue';
import ListRelated from '~/components/ListRelated.vue';
import Banners from '~/components/Banners.vue';
import CommentsList from '~/components/CommentsList.vue';

const cssGallery = () => import('../assets/scss/05-components/gallery-tiled.scss');

const registerModules = (store) => {
    store.$registerModules([
        { name: ['data', 'dataSingle'], imported: dataSingle, preserveStateCheck: true },
        { name: ['data', 'dataComments'], imported: dataComments, preserveStateCheck: true },
    ]);
};

export default {
    components: {
        ListItemInfo,
        ListShare,
        ListRelated,
        Banners,
        CommentsList,
    },

    mixins: [
        currentPage,
    ],

    async asyncData({ store, route }) {
        registerModules(store);

        let actionName = 'data/fetchPageSingle';
        if (route.params.singleType === 'post') actionName = 'data/fetchPagePost';
        else if (route.params.singleType === 'page') actionName = 'data/fetchPagePage';

        await Promise.all([
            store.dispatch(actionName, {
                route,
            }),
            store.dispatch('data/fetchComments', {
                route,
            }),
        ]);
    },

    data: () => ({
        photoswipe: {
            index: false,
            items: [],
        },
    }),

    created() {
        const hasEntrysGalleryJetpack = this.data.main.content.rendered.indexOf('tiled-gallery') !== -1; /* indexOf is faster */// eslint-disable-line unicorn/prefer-includes
        if (hasEntrysGalleryJetpack) cssGallery();
    },

    mounted() {
        registerModules(this.$store);

        this.setDataPhotoswipe();
    },

    methods: {
        async fetchComments(isVisible, checkForData) {
            const { classList: commentsClass } = this.$refs.comments.$el;
            const loading = commentsClass.contains('loading');

            if (!isVisible && !loading) return;

            if (checkForData && this.data.comments) return;

            const hasNextPage = this.data.comments
                && this.data.comments.pageInfo
                && this.data.comments.pageInfo.hasNextPage;

            if (hasNextPage === false) return;

            commentsClass.add('loading');

            await this.$store.dispatch('data/fetchComments', {
                route: this.$route,
            });

            commentsClass.remove('loading');
        },
        setDataPhotoswipe() {
            this.$refs.content.querySelectorAll('img').forEach((img, index) => {
                const src = (img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('data-orig-file')).split('?')[0];
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

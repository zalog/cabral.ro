<template>
    <div v-if="data">
        <div class="entry-body">
            <div class="entry-header">
                <h1
                    v-html="data.main.title /* eslint-disable-line vue/no-v-html */"
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
            <div
                v-observe-visibility="false && data.main.categories
                    ? {
                        callback: isVisible => isVisible && (load.banners = true),
                        once: true
                    }
                    : false
                "
            >
                <lazy-banners v-if="load.banners">
                    <a href="http://www.runningmag.ro/" target="_blank" title="runningmag.ro" rel="external nofollow noopener">
                        <img src="https://www.cabral.ro/ads/300x250-runningmag.ro-26012018.png" width="300" height="250" alt="runningmag.ro">
                    </a>
                </lazy-banners>
            </div>
            <comments-list
                ref="comments"
                :comments="data.comments"
                :single-id="data.main.id"
                :single-comment-status="data.main.commentStatus"
                :hide-comments="hideComments()"
                @is-visible-last="fetchComments(true)"
            />
        </div>
        <lazy-base-gallery
            v-if="galleryFull.show"
            v-model="galleryFull.index"
            :items="galleryFull.items"
            :hash="galleryFullHash"
            :page-title="$metaInfo.title"
            @hidden="galleryFull.show = false"
            @update:index="onGalleryFullUpdate()"
        />
    </div>
</template>

<script>
import Vue from 'vue';
import dataSingle from '~/store/lazy/data-single';
import dataComments from '~/store/lazy/data-single-comments';
import { currentPage } from '~/mixins';
import { ObserveVisibility } from 'vue-observe-visibility';
import ListItemInfo from '~/components/ListItemInfo.vue';
import ListShare from '~/components/ListShare.vue';
import ListRelated from '~/components/ListRelated.vue';
import CommentsList from '~/components/CommentsList.vue';

Vue.directive('observe-visibility', ObserveVisibility);

const cssGallery = () => import('../assets/scss/05-components/gallery-tiled.scss');

const galleryFullHash = 'pid';

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
        CommentsList,
    },

    mixins: [
        currentPage,
    ],

    async asyncData({ store, route, error }) {
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

        const data = store.getters['data/currentPage'](route.fullPath);

        if (!data.main) return error({ statusCode: 404, message: 'Nu am găsit pagina' });

        return null;
    },

    data: () => ({
        load: {
            banners: false,
        },
        galleryFull: {
            show: null,
            index: null,
            items: [],
        },
    }),

    created() {
        if (this.data.main) {
            const hasEntrysGalleryJetpack = this.data.main.content.rendered.indexOf('tiled-gallery') !== -1; /* indexOf is faster */// eslint-disable-line unicorn/prefer-includes
            if (hasEntrysGalleryJetpack) cssGallery();
        }

        this.galleryFullHash = galleryFullHash;
    },

    mounted() {
        registerModules(this.$store);

        if (this.data.main) {
            this.attachForm();
        }

        this.attachGallery();
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
        hideComments() {
            const categoryContests = !!this.data.main.categories.find((item) => item.link === '/category/concursuri/');

            if (!categoryContests) return false;

            return this.data.main.commentStatus === 'open';
        },
        attachForm() {
            const forms = this.$refs.content.querySelectorAll('.wpcf7-form');

            if (!forms.length) return;

            import('../utils/customs/form-cf7')
                .then((module) => forms.forEach((formEl) => {
                    const { default: Form } = module;
                    const form = new Form(formEl, this.$axios);
                    form.init();
                }));
        },
        attachGallery() {
            const imgs = this.$refs.content.querySelectorAll('img');

            if (!imgs.length) return;

            imgs.forEach((img, imgIndex) => {
                const a = img.parentElement;

                if (!(a instanceof HTMLAnchorElement)) return;

                const src = img.getAttribute('data-orig-file') || a.getAttribute('href');
                this.galleryFull.items.push({
                    src,
                });

                if (!this.galleryFull.items.length) return;

                a.addEventListener('click', (event) => {
                    event.preventDefault();

                    this.galleryFull = {
                        show: true,
                        index: imgIndex,
                        items: this.galleryFull.items,
                    };
                });
            });

            if (this.$route.hash.indexOf(`${galleryFullHash}=`) !== -1) {
                const hashIndex = Number(this.$route.hash.split('=')[1]);
                this.galleryFull = {
                    show: true,
                    index: hashIndex - 1,
                    items: this.galleryFull.items,
                };
            }
        },
        onGalleryFullUpdate() {
            this.sendPageView({
                title: this.$metaInfo.title,
                url: this.$route.fullPath,
            });
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/07-trumps/page-single";
</style>

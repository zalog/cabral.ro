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
                        text: formatDate(data.main.date),
                    }, {
                        icon: 'folder',
                        links: data.main.categories,
                    }, {
                        icon: 'comment',
                        text: data.main.commentsNumber,
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
                        once: true,
                    }
                    : false
                "
            >
                <lazy-base-banners v-if="load.banners">
                    <a
                        href="http://www.runningmag.ro/"
                        target="_blank"
                        title="runningmag.ro"
                        rel="external nofollow noopener"
                    >
                        <img
                            src="https://www.cabral.ro/ads/300x250-runningmag.ro-26012018.png"
                            width="300"
                            height="250"
                            alt="runningmag.ro"
                        >
                    </a>
                </lazy-base-banners>
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
            v-model:index="galleryFull.index"
            :items="galleryFull.items"
            :hash="galleryFullHash"
            :page-title="data.head.title"
            @hidden="galleryFull.show = false"
            @update:index="onGalleryFullUpdate()"
        />
    </div>
</template>

<script>
import { createError, defineNuxtComponent, useRoute } from '#imports';
import { currentPage } from '~/mixins';
import { formatDate } from '~/utils';
import ListItemInfo from '~/components/ListItemInfo.vue';
import ListShare from '~/components/ListShare.vue';
import ListRelated from '~/components/ListRelated.vue';
import CommentsList from '~/components/CommentsList.vue';

const cssGallery = () => import('../assets/scss/05-components/gallery-tiled.scss');

const galleryFullHash = 'pid';

export default defineNuxtComponent({
    components: {
        ListItemInfo,
        ListShare,
        ListRelated,
        CommentsList,
    },

    mixins: [
        currentPage,
    ],

    asyncData({ $store: store }) {
        const data = store.getters['data/currentPage'](useRoute().fullPath);

        if (!data.main) {
            throw createError({ statusCode: 404, statusMessage: 'Nu am găsit pagina', fatal: true });
        }

        return {};
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
            const hasEntrysGalleryJetpack = this.data.main.content.rendered.indexOf('tiled-gallery') !== -1;
            if (hasEntrysGalleryJetpack) cssGallery();
        }

        this.galleryFullHash = galleryFullHash;
    },

    mounted() {
        if (this.data.main) {
            this.attachForm();
        }

        this.attachGallery();
    },

    methods: {
        formatDate,
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
            const categoryContests = !!this.data.main.categories?.find((item) => item.link === '/category/concursuri/');

            if (!categoryContests) return false;

            return this.data.main.commentStatus === 'open';
        },
        attachForm() {
            const forms = this.$refs.content.querySelectorAll('.wpcf7-form');

            if (!forms.length) return;

            import('../utils/customs/form-cf7')
                .then((module) => forms.forEach((formEl) => {
                    const { default: Form } = module;
                    const form = new Form(formEl);
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

            if (this.$route.hash.includes(`${galleryFullHash}=`)) {
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
                title: this.data.head.title,
                url: this.$route.fullPath,
            });
        },
    },
});
</script>

<style lang="scss">
@import "~/assets/scss/07-trumps/page-single";
</style>

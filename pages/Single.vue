<template>
    <div v-if="data">
        <div
            :class="data.main.featuredMedia
                ? '-mx-3 mt-[-100px] rounded-t-lg bg-white p-3 sm:-mx-6 sm:px-6 sm:pt-6 sm:pb-0'
                : 'mb-12'"
        >
            <div class="mb-4">
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
                class="wp-content entry-content mb-12 font-serif text-xl/[1.9] wrap-break-word"
                v-html="data.main.content.rendered/* eslint-disable-line vue/no-v-html */"
            />
            <list-share
                class="mb-12 scrollbar-none overflow-x-auto whitespace-nowrap"
                :url="data.main.link"
            />
            <list-related
                v-if="data.related?.length"
                class="mb-12"
                :data="data.related"
            />
            <comments-list
                ref="comments"
                class="mb-12"
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
import { defineNuxtComponent, useRoute } from '#imports';
import useCurrentPage from '~/composables/useCurrentPage';
import { formatDate, notFound } from '~/utils';
import ListItemInfo from '~/components/ListItemInfo.vue';
import ListShare from '~/components/ListShare.vue';
import ListRelated from '~/components/ListRelated.vue';
import CommentsList from '~/components/CommentsList.vue';

const cssGallery = () => import('../assets/css/gallery-tiled.css');

const galleryFullHash = 'pid';
const imageFile = /\.(avif|gif|jpe?g|png|webp)$/i;

export default defineNuxtComponent({
    components: {
        ListItemInfo,
        ListShare,
        ListRelated,
        CommentsList,
    },

    setup() {
        return useCurrentPage();
    },

    asyncData({ $store: store }) {
        const data = store.getters['data/currentPage'](useRoute().fullPath);

        if (!data.main) {
            throw notFound();
        }

        return {};
    },

    data: () => ({
        galleryFull: {
            show: null,
            index: null,
            items: [],
        },
    }),

    created() {
        if (this.data.main) {
            const hasEntrysGalleryJetpack = this.data.main.content.rendered.includes('tiled-gallery');
            if (hasEntrysGalleryJetpack) {
                cssGallery().catch((error) => {
                    console.error('load error gallery styles: ', error);
                });
            }
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

            const hasNextPage = this.data.comments?.pageInfo?.hasNextPage;

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
                }))
                .catch((error) => {
                    console.error('load error contact form: ', error);
                });
        },
        attachGallery() {
            const imgs = this.$refs.content.querySelectorAll('img');

            if (!imgs.length) return;

            imgs.forEach((img) => {
                const a = img.parentElement;

                if (!(a instanceof HTMLAnchorElement) || !imageFile.test(a.pathname)) return;

                const index = this.galleryFull.items.length;
                const src = img.dataset.origFile || a.getAttribute('href');
                this.galleryFull.items.push({
                    src,
                });

                a.addEventListener('click', (event) => {
                    event.preventDefault();

                    this.galleryFull = {
                        show: true,
                        index,
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

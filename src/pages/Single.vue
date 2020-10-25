<template>
    <div
        v-if="data.single"
        class="page-single"
    >
        <div
            v-if="data.single.featuredMedia"
            class="entry-img-hero"
            v-html="data.single.featuredMedia"
        />
        <div
            class="container-fluid"
        >
            <h1
                v-html="data.single.title"
                class="entry-title"
            />
            <list-item-info
                :data="[{
                    icon: 'date',
                    text: $options.filters.formatDate(data.single.date)
                }, {
                    icon: 'folder',
                    links: data.single.categories
                }, {
                    icon: 'comment',
                    text: data.single.commentsNumber
                }]"
            />
            <div
                ref="content"
                v-html="data.single.content"
                class="entry-content"
            />
            <list-share :url="data.single.link" />
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

            <div class="container-fluid">
                <comments-list ref="comments" />
            </div>
        </div>

        <photoswipe
            v-if="photoswipe.show"
            :items="photoswipe.items"
            :index="photoswipe.index"
            :title="pageTitle"
            @closed="photoswipe.show = false; sendPageView();"
        />
    </div>
</template>

<script>
import './../utils/filters/formatDate';
import { formatHtmlTitle } from './../utils';
import CommentsList from './../components/CommentsList.vue';
import ListItemInfo from './../components/ListItemInfo.vue';
import ListShare from './../components/ListShare.vue';
import ListRelated from './../components/ListRelated.vue';
import { postFormWpcf7 } from './../services/forms';

const Photoswipe = () => import(/* webpackChunkName: "photoswipe" */ './../components/Photoswipe.vue');

export default {
    name: 'PageSingle',

    components: {
        CommentsList,
        ListItemInfo,
        ListShare,
        ListRelated,
        Photoswipe
    },

    data: () => ({
        photoswipe: {
            show: false,
            items: [],
            index: 0
        }
    }),

    computed: {
        data() {
            return this.$store.getters['data/currentPage']();
        },
        pageTitle() {
            if (!this.data.single) return;

            return this.data.single.title;
        }
    },

    watch: {
        '$route': 'fetchPage'
    },

    serverPrefetch() {
        return this.fetchPage();
    },

    beforeMount() {
        this.fetchPage();
    },

    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },

    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    },

    methods: {
        fetchPage() {
            let actionName = 'data/fetchSingle';
            if (this.$route.params.singleType === 'post') actionName = 'data/fetchPost';
            else if (this.$route.params.singleType === 'page') actionName = 'data/fetchPage';

            return this.$store.dispatch(actionName).then(() => {
                this.afterDataLoaded();
            });
        },
        afterDataLoaded() {
            if (typeof window === 'undefined') return;

            this.sendPageView();
            this.photoswipeInit();
            this.fetchComments();
            this.handleFormWpcf7();
        },
        sendPageView() {
            window.dataLayer.push({ event: 'pageview', title: formatHtmlTitle(this.pageTitle) });
        },
        photoswipeInit() {
            this.$refs['content'].querySelectorAll('img').forEach((img, index) => {
                let src = img.getAttribute('data-src') || img.getAttribute('data-orig-file');
                src = src.split('?')[0];
                let size = img.getAttribute('data-orig-size') || '0,0';
                size = size.split(',');

                this.photoswipe.items.push({ src, w: size[0], h: size[1] });

                img.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.photoswipe.show = true;
                    this.photoswipe.index = index;
                });
            });
        },
        fetchComments() {
            if (this.data.comments && this.data.comments.loading || !this.isVisibleLastComment()) return;

            this.$store.dispatch('data/fetchSingleComments');
        },
        handleScroll() {
            this.fetchComments();
        },
        isVisibleLastComment() {
            if (!this.$refs['comments']) return;

            let comments = this.$refs['comments'].$el.getBoundingClientRect();
            const visible = document.documentElement.clientHeight;
            const commentsTop = comments.top + comments.height;

            return (visible >= commentsTop);
        },
        handleFormWpcf7() {
            const elSpinner = document.createElement('div');
            elSpinner.classList.add('spinner-border', 'spinner-border-sm', 'mr-1');

            this.$refs['content'].querySelectorAll('.wpcf7').forEach((formWrap) => {
                const elFormMessage = formWrap.querySelector('.screen-reader-response');
                const elForm = formWrap.querySelector('.wpcf7-form');
                const elBtnSubmit = formWrap.querySelector('.wpcf7-submit');
                const formId = elForm.querySelector('input[name="_wpcf7"]').value;

                elForm.addEventListener('submit', (event) => {
                    event.preventDefault();

                    elBtnSubmit.insertBefore(elSpinner, elBtnSubmit.querySelector('span'));
                    elFormMessage.classList = '';

                    const formData = new FormData(event.target);

                    postFormWpcf7(formId, formData).then((response) => {
                        let alertClass = 'danger';

                        if (response.status === 'mail_sent') {
                            alertClass = 'success';
                            elForm.querySelectorAll('input, textarea').forEach((el) => {
                                el.value = '';
                                el.classList.remove('is-invalid');
                            });
                        } else {
                            // console.log(response.invalidFields);
                            response.invalidFields.forEach((field) => {
                                elForm.querySelectorAll(field.into).forEach(el => {
                                    el.querySelector('.wpcf7-form-control').classList.add('is-invalid');
                                });
                            });
                        }

                        elFormMessage.textContent = response.message;
                        elFormMessage.classList.add('alert', `alert-${alertClass}`);
                    }).catch((error) => {
                        elFormMessage.textContent = error.message;
                        elFormMessage.classList.add('alert', 'alert-danger');
                    }).finally(() => {
                        elBtnSubmit.removeChild(elSpinner);
                    });
                });
            });
        }
    },

    metaInfo() {
        return {
            title: this.pageTitle
        };
    }
};
</script>

<style lang="scss" scoped>
@import "./../scss/app-component.scss";

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
    @import "./../scss/pages/single";
}
</style>

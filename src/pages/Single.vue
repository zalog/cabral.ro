<template>
    <div
        v-if="data.single"
        class="page-single"
    >
        <div
            class="container-fluid py-5"
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
        </div>

        <div class="bg-light">
            <div class="container-fluid py-5">
                <comments-list
                    ref="comments"
                />
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
import { SITE } from './../utils/constants';
import { decodeHtml } from './../utils';
import CommentsList from './../components/CommentsList.vue';
import ListItemInfo from './../components/ListItemInfo.vue';
import { postFormWpcf7 } from './../services/forms';

const Photoswipe = () => import(/* webpackChunkName: "photoswipe" */ './../components/Photoswipe.vue');

export default {
    name: 'PageSingle',

    components: {
        CommentsList,
        ListItemInfo,
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
            return this.$store.getters['data/currentPage'];
        },
        pageTitle() {
            return this.data.single && decodeHtml(this.data.single.title.rendered);
        }
    },

    watch: {
        '$route': 'fetchSingle'
    },

    serverPrefetch() {
        return this.fetchSingle();
    },

    beforeMount() {
        this.fetchSingle();
    },

    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },

    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    },

    methods: {
        fetchSingle() {
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
            window.dataLayer.push({ event: 'pageview', title: SITE.TITLE_TEMPLATE(this.pageTitle) });
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

            this.$store.dispatch('data/fetchComments');
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
    max-width: 700px;
}

.entry-content {
    word-wrap: break-word;
}

/deep/ {
    @import "~bootstrap/scss/alert";
    @import "./../scss/pages/single";
}
</style>

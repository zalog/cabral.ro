<template>
    <div
        v-if="data"
        class="page-single"
    >
        <div
            v-if="data.main.single.featuredMedia"
            class="entry-img-hero"
            v-html="data.main.single.featuredMedia"
        />
        <div
            class="container-fluid"
        >
            <h1
                v-html="data.main.single.title"
                class="entry-title"
            />
            <list-item-info
                :data="[{
                    icon: 'date',
                    text: $options.filters.formatDate(data.main.single.date)
                }, {
                    icon: 'folder',
                    links: data.main.single.categories
                }, {
                    icon: 'comment',
                    text: data.main.single.commentsNumber
                }]"
            />
            <div
                ref="content"
                v-html="data.main.single.content"
                class="entry-content"
            />
            <list-share :url="data.main.single.link" />
        </div>

        <div class="bg-light">
            <template
                v-if="data.main.related"
            >
                <div class="container-fluid">
                    <list-related :data="data.main.related" />
                </div>

                <hr class="d-none d-lg-block" />
            </template>
        </div>
    </div>
</template>

<script>
import dataSingle from '~/store/lazy/data-single';
import { currentPage } from '~/mixins';
import ListItemInfo from '~/components/ListItemInfo.vue';
import ListShare from '~/components/ListShare.vue';
import ListRelated from '~/components/ListRelated.vue';

export default {
    components: {
        ListItemInfo,
        ListShare,
        ListRelated
    },

    mixins: [
        currentPage
    ],

    async asyncData({ store, route }) {
        store.registerModule(['data', 'dataSingle'], dataSingle);

        let actionName = 'data/fetchPageSingle';
        if (route.params.singleType === 'post') actionName = 'data/fetchPagePost';
        else if (route.params.singleType === 'page') actionName = 'data/fetchPagePage';

        await store.dispatch(actionName, {
            route
        });
    },

    beforeDestroy() {
        this.$store.unregisterModule(['data', 'dataSingle']);
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

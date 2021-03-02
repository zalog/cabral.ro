<template>
    <div
        v-if="posts.posts.length"
        class="cards-posts"
    >
        <template v-for="(post, index) in posts.posts">
            <base-item-post
                :key="`post-${index}`"
                :post="post"
                :img="post.featuredMedia"
                :img-info="[{
                    icon: 'comment',
                    text: post.commentsNumber
                }]"
                :title="post.title"
                :slug="post.slug"
                :body-info="[{
                    icon: 'date',
                    text: $options.filters.formatDate(post.date)
                }, {
                    icon: 'folder',
                    links: post.categories
                }]"
                :body-text="post.excerpt"
            />
        </template>

        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <router-link
                    v-for="(page, index) in posts.pagination.pages"
                    :key="'pagination-page-' + index"
                    tag="li"
                    class="page-item"
                    :to="paginationTo(page)"
                    :class="{ active: [posts.pagination.currentPage] == page }"
                >
                    <a class="page-link">{{ page }}</a>
                </router-link>
            </ul>
        </nav>
    </div>
    <div v-else>
        Niciun articol aici.
    </div>
</template>

<script>
import BaseItemPost from '~/components/BaseItemPost.vue';

export default {
    name: 'PostsList',

    components: {
        BaseItemPost,
    },

    props: {
        posts: {
            type: Object,
            required: true,
        },
    },

    methods: {
        paginationTo(page) {
            const routeCategory = this.$route.params.categorySlug;
            const routeS = (typeof this.$route.query.s !== 'undefined' && `?s=${this.$route.query.s}`) || '';
            let url = `/page/${page}/${routeS}`;

            if (routeCategory) url = `/category/${routeCategory}${url}`;

            return url;
        },
    },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/app-component.scss";

$pagination-color:            $body-color;
$pagination-bg:               transparent;
$pagination-border-width:     0;
$pagination-hover-color:      $pagination-color;
$pagination-hover-bg:         transparent;
$pagination-active-color:     $pagination-hover-color;
$pagination-active-bg:        $gray-100;
$pagination-focus-box-shadow: none;

@import "~bootstrap/scss/pagination";

.cards-posts {
    .card {
        margin-bottom: map-get($spacers, 5);
    }

    .pagination {
        .active {
            font-weight: bold;
            box-shadow: $box-shadow;
        }
    }
}
</style>

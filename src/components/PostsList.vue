<template>
    <div
        class="cards-posts"
        v-if="posts.data.length"
    >
        <template v-for="(post, index) in posts.data">
            <base-item-post
                :key="`post-${index}`"
                :post="post"
            />
        </template>

        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <router-link
                    tag="li"
                    class="page-item"
                    v-ripple="'rgba(00, 00, 00, 0.1)'"
                    v-for="(page, index) in posts.pagination.data" :key="'pagination-page-' + index"
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
import './../utils/filters/formatDate';
import BaseItemPost from './BaseItemPost.vue';

export default {
    name: 'PostsList',

    components: {
        BaseItemPost
    },

    props: {
        posts: {
            type: Object,
            required: true
        }
    },

    methods: {
        paginationTo(page) {
            const routeCategory = this.$route.params.categorySlug;
            const routeS = typeof this.$route.query.s !== 'undefined' && `?s=${this.$route.query.s}` || '';
            let url = `/page/${page}/${routeS}`;

            if (routeCategory) url = `/category/${routeCategory}${url}`;

            return url;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./../scss/app-component.scss";

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

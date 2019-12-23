<template>
    <div
        class="cards-posts"
        v-if="posts.data.length"
    >
        <router-link
            tag="div"
            class="card mb-5"
            v-ripple
            v-for="(post, index) in posts.data" :key="'posts-post-' + index"
            :to="postTo(post.slug)"
        >
            <div
                v-if="post.featuredMedia"
                class="card-img-top"
            >
                <div class="img" v-html="post.featuredMedia" />
                <ul class="list-img-info">
                    <li>
                        <base-icon name="comment" class="icon-sm" />
                        {{ post.commentsNumber }}
                    </li>
                </ul>
            </div>
            <div class="card-body" :to="postTo(post.slug)">
                <h2 class="card-title">
                    <router-link v-html="post.title" :to="postTo(post.slug)" />
                </h2>
                <ul class="list-card-info">
                    <li v-for="(category, index) in post.categories" :key="`post-category-${index}`">
                        <base-icon v-if="!index" name="folder" />
                        <router-link
                            :to="category.link"
                        >
                            {{ category.name }}
                        </router-link>
                    </li>
                    <li>
                        <base-icon name="date" />
                        {{ post.date | formatDate }}
                    </li>
                </ul>
                <div class="card-text" v-html="post.excerpt" />
            </div>
        </router-link>

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

export default {
    name: 'PostsList',

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
        },
        postTo(slug) {
            return {
                name: 'single',
                params: {
                    singleSlug: slug,
                    singleType: 'post'
                }
            };
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./../scss/app-component.scss";

$card-border-radius:          $border-radius-lg;
$card-border-color:           transparent;

$pagination-color:            $body-color;
$pagination-bg:               transparent;
$pagination-border-width:     0;
$pagination-hover-color:      $pagination-color;
$pagination-hover-bg:         transparent;
$pagination-active-color:     $pagination-hover-color;
$pagination-active-bg:        $gray-100;
$pagination-focus-box-shadow: none;

@import "~bootstrap/scss/card";
@import "~bootstrap/scss/pagination";

.cards-posts /deep/ {
    .img {
        position: relative;
        padding-top: percentage(9/16);
        overflow: hidden;

        img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: auto;
        }
    }

    .card-text > {
        p a {
            display: none;
        }

        *:last-child {
            margin-bottom: 0;
        }
    }
}

.list-img-info {
    @include list-unstyled;
    display: flex;

    li {
        padding: $badge-padding-y $badge-padding-x;
        font-size: $badge-font-size;
        border-radius: $badge-border-radius;
        background-color: rgba($white, .75);
        color: $gray-800;
    }

    li + li {
        margin-left: $spacer;
    }
}

.list-card-info {
    @include list-unstyled;
    display: flex;
    flex-wrap: wrap;
    margin-top: -(map-get($spacers, 2));
    margin-bottom: $spacer;
    font-size: $font-size-sm;

    &,
    a {
        color: $text-muted;
    }

    li {
        margin-right: map-get($spacers, 2);
    }
}

.cards-posts {
    .card {
        cursor: pointer;
        box-shadow: $box-shadow-lg;
        border: 0;
    }
    .card-img-top {
        position: relative;
        overflow: hidden;

        .list-img-info {
            position: absolute;
            top: $spacer;
            right: $spacer;
        }
    }
    .card-title > a {
        color: $body-color;
    }

    .pagination {
        .active {
            font-weight: bold;
            box-shadow: $box-shadow;
        }
    }
}
</style>

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

        <nav
            v-if="posts.pagination"
            aria-label="Page navigation"
        >
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
            const { pathMatch, slug } = this.$route.params;
            let output = '/';

            if (pathMatch && slug) output += `${pathMatch}/${slug.split('/page/')[0]}/`;
            if (page > 1) output += `page/${page}/`;
            if (typeof this.$route.query.s !== 'undefined') output += `?s=${this.$route.query.s}`;

            return output;
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/posts-list";
</style>

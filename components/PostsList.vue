<template>
    <div
        v-if="posts.posts.length"
        class="cards-posts"
    >
        <template v-for="(post, index) in posts.posts">
            <base-item-post
                :key="`post-${index}`"
                :img="post.featuredMedia"
                :img-loading="index === 0 ? 'eager' : 'lazy'"
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
            <ul class="pagination">
                <template v-for="(page, index) in posts.pagination.pages">
                    <li
                        v-if="page !== '...'"
                        :key="'pagination-item-' + index"
                        class="page-item"
                    >
                        <router-link
                            :to="paginationTo(page)"
                            class="page-link"
                            active-class
                            exact-active-class
                            :class="{ active: [posts.pagination.currentPage] == page }"
                        >
                            {{ page }}
                        </router-link>
                    </li>
                    <li
                        v-else
                        :key="'pagination-item-' + index"
                        class="page-item"
                    >
                        {{ page }}
                    </li>
                </template>
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

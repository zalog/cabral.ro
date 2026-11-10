<template>
    <div v-if="posts.posts.length">
        <base-item-post
            v-for="(post, index) in posts.posts"
            :key="`post-${index}`"
            :img="post.featuredMedia"
            :img-loading="index === 0 ? 'eager' : 'lazy'"
            :img-info="[{
                icon: 'comment',
                text: post.commentsNumber,
            }]"
            :title="post.title"
            :slug="post.slug"
            :body-info="[{
                icon: 'date',
                text: formatDate(post.date),
            }, {
                icon: 'folder',
                links: post.categories,
            }]"
            :body-text="post.excerpt"
            class="mb-12"
        />

        <nav
            v-if="posts.pagination"
            aria-label="Page navigation"
            class="overflow-x-auto"
        >
            <ul class="mb-4 flex">
                <template
                    v-for="(page, index) in posts.pagination.pages"
                    :key="'pagination-item-' + index"
                >
                    <li v-if="page !== '...'">
                        <router-link
                            :to="paginationTo(page)"
                            class="relative block rounded-md px-3 py-1.5 text-gray-900 no-underline transition-[color,background-color,border-color,box-shadow] duration-150 ease-in-out hover:z-2"
                            active-class
                            exact-active-class
                            :class="([posts.pagination.currentPage] == page)
                                ? 'z-3 bg-gray-100 font-bold shadow-md'
                                : 'focus:z-3 focus:bg-gray-200 focus:text-primary-700 focus:outline-none'"
                        >
                            {{ page }}
                        </router-link>
                    </li>
                    <li v-else>
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
import { formatDate } from '~/utils';
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
        formatDate,
        paginationTo(page) {
            const { pathMatch, slug } = this.$route.params;
            let output = '/';

            if (pathMatch && slug) output += `${pathMatch}/${slug.split('/page/')[0]}/`;
            if (page > 1) output += `page/${page}/`;
            if (this.$route.query.s !== undefined) output += `?s=${this.$route.query.s}`;

            return output;
        },
    },
};
</script>

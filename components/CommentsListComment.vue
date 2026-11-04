<template>
    <div class="bg-gray-100 p-6 text-gray-700 [&_a]:text-inherit">
        <div class="mb-4">
            <template v-if="comment.author.node">
                <template v-if="!comment.author.node.url">
                    {{ comment.author.node.name }}
                </template>
                <a
                    v-else
                    :href="comment.author.node.url"
                    target="_blank"
                    rel="external nofollow ugc"
                >
                    {{ comment.author.node.name }}
                </a>
            </template>
            <list-item-info
                :data="[{
                    icon: 'date',
                    text: formatDate(comment.date),
                }]"
            />
        </div>
        <div
            class="wp-content wrap-break-word [&_iframe]:max-w-full [&>p:last-child]:mb-0"
            v-html="comment.content/* eslint-disable-line vue/no-v-html */"
        />
    </div>
</template>

<script>
import { formatDate } from '~/utils';
import ListItemInfo from './ListItemInfo.vue';

export default {
    components: {
        ListItemInfo,
    },

    props: {
        comment: {
            type: Object,
            required: true,
        },
    },

    methods: {
        formatDate,
    },
};
</script>

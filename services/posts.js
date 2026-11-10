import paginate from 'jw-paginate';
import { ENDPOINTS } from '~/utils/constants';
import { itemPost } from '~/utils/adaptors';

const paginationMaxPages = 8;
const itemsOnPage = 10;

const fetchPosts = async ({
    params,
    fields = [],
    taxonomy = {
        categories: [],
        tags: [],
    },
    pagination,
}) => {
    Object.assign(params, {
        ...(fields.length && {
            _fields: fields.join(','),
        }),
        ...(taxonomy.categories.length && {
            'categories[terms]': taxonomy.categories.join(','),
            'categories[include_children]': true,
        }),
        ...(taxonomy.tags.length && {
            tags: taxonomy.tags.join(','),
        }),
        per_page: pagination.itemsOnPage || itemsOnPage,
        ...(pagination.currentPage && {
            page: pagination.currentPage,
        }),
        ...params,
    });
    Object.assign(pagination, {
        itemsOnPage,
        currentPage: 1,
        ...pagination,
    });
    const output = {};

    const responsePosts = await $fetch.raw(ENDPOINTS.POSTS, {
        query: params,
    });
    const responsePostsCount = Number.parseInt(responsePosts.headers.get('x-wp-total'), 10);
    const responsePostsPages = responsePostsCount > pagination.itemsOnPage;

    output.posts = responsePosts._data.map((post) => itemPost(post));

    if (responsePostsPages) {
        const pages = [];
        const responsePagination = paginate(
            responsePostsCount,
            pagination.currentPage,
            pagination.itemsOnPage,
            paginationMaxPages,
        );

        if (responsePagination.pages[0] !== 1) {
            pages.push(1, '...');
        }
        pages.push(...responsePagination.pages);
        if (responsePagination.pages[paginationMaxPages - 1] !== responsePagination.totalPages) {
            pages.push('...', responsePagination.totalPages);
        }

        output.pagination = {
            pages,
            currentPage: responsePagination.currentPage,
        };
    }

    return output;
};

export default fetchPosts;

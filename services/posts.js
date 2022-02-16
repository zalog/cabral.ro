import paginate from 'jw-paginate';
import { ENDPOINTS } from '~/utils/constants';
import { itemPost } from '~/utils/adaptors';

const paginationMaxPages = 8;
const itemsOnPage = 10;

const fetchPosts = async ({
    $axios,
    params,
    fields = [],
    taxonomy = {
        categories: [],
    },
    pagination,
}) => {
    Object.assign(params, {
        ...(fields.length && {
            _fields: fields.join(','),
        }),
        ...(taxonomy.categories.length && {
            'filter[category_name]': taxonomy.categories.join(',') || undefined,
        }),
        per_page: pagination.itemsOnPage || itemsOnPage,
        page: pagination.currentPage,
        ...params,
    });
    Object.assign(pagination, {
        itemsOnPage,
        currentPage: 1,
        ...pagination,
    });
    const output = {};

    // posts: fetch
    const responsePosts = await $axios({
        method: 'get',
        url: ENDPOINTS.POSTS,
        params,
    });
    const responsePostsCount = parseInt(responsePosts.headers['x-wp-total'], 10);
    const responsePostsPages = responsePostsCount > pagination.itemsOnPage;

    output.posts = responsePosts.data.map((post) => itemPost(post));

    // posts: pagination
    if (responsePostsPages) {
        const responsePagination = paginate(
            responsePostsCount,
            pagination.currentPage,
            pagination.itemsOnPage,
            paginationMaxPages,
        );

        output.pagination = {
            pages: responsePagination.pages,
            currentPage: responsePagination.currentPage,
        };
    }

    return output;
};

export { fetchPosts as default };

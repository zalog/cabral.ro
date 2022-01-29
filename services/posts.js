import paginate from 'jw-paginate';
import { ENDPOINTS } from '~/utils/constants';
import { itemPost } from '~/utils/adaptors';

const paginationMaxPages = 8;
const itemsOnPage = 10;

const fetchPosts = async ({
    $axios,
    params,
    categories = [],
    pagination,
}) => {
    Object.assign(params, {
        fields: [],
        search: '',
        ...params,
    });
    Object.assign(pagination, {
        itemsOnPage,
        currentPage: 1,
        ...pagination,
    });
    const output = {};

    // posts: params
    const paramsPosts = {
        ...(params.fields.length && {
            fields: params.fields.join(','),
        }),
        ...(params.search && {
            search: params.search,
        }),
        ...(categories.length && {
            'filter[category_name]': categories.join(','),
        }),
        per_page: pagination.itemsOnPage,
        page: pagination.currentPage,
    };

    // posts: fetch
    const responsePosts = await $axios({
        method: 'get',
        url: ENDPOINTS.POSTS,
        params: paramsPosts,
    });

    output.posts = responsePosts.data.map((post) => itemPost(post));

    // posts: pagination
    const responsePagination = paginate(
        parseInt(responsePosts.headers['x-wp-total'], 10),
        pagination.currentPage,
        pagination.itemsOnPage,
        paginationMaxPages,
    );

    output.pagination = {
        pages: responsePagination.pages,
        currentPage: responsePagination.currentPage,
    };

    return output;
};

export { fetchPosts as default };

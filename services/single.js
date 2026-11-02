import { ENDPOINTS } from '~/utils/constants';
import { pageSinglePost, pageSinglePage } from '~/utils/adaptors';

export async function fetchPost({
    params,
    fields = [],
}) {
    Object.assign(params, {
        _fields: fields.join(','),
        ...params,
    });

    const response = await $fetch(ENDPOINTS.POSTS, {
        query: params,
    });

    if (!response.length) return false;

    return pageSinglePost(response[0]);
}

export async function fetchPage({
    params,
    fields = [],
}) {
    Object.assign(params, {
        _fields: fields.join(','),
        ...params,
    });

    const response = await $fetch(ENDPOINTS.PAGES, {
        query: params,
    });

    if (!response.length) return false;

    return pageSinglePage(response[0]);
}

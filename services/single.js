import { ENDPOINTS } from '~/utils/constants';
import { pageSinglePost, pageSinglePage } from '~/utils/adaptors';

export async function fetchPost({
    $axios,
    params,
    fields = [],
}) {
    Object.assign(params, {
        fields: fields.join(','),
        ...params,
    });

    const response = await $axios({
        method: 'get',
        url: `${ENDPOINTS.POSTS}`,
        params,
    });

    if (!response.data.length) return false;

    return pageSinglePost(response.data[0]);
}

export async function fetchPage({
    $axios,
    params,
    fields = [],
}) {
    Object.assign(params, {
        fields: fields.join(','),
        ...params,
    });

    const response = await $axios({
        method: 'get',
        url: `${ENDPOINTS.PAGES}`,
        params,
    });

    if (!response.data.length) return false;

    return pageSinglePage(response.data[0]);
}

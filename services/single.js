import { ENDPOINTS } from '~/utils/constants';
import { pageSinglePost, pageSinglePage } from '~/utils/adaptors';

export async function fetchPost(payload) {
    const { params } = payload;

    // prepare params data values
    if (payload.fields?.length) params.fields = payload.fields.join(',');

    const response = await payload.$axios({
        method: 'get',
        url: `${ENDPOINTS.POSTS}`,
        params,
    });

    if (!response.data.length) return false;

    return pageSinglePost(response.data[0]);
}

export async function fetchPage(payload) {
    const { params } = payload;

    // prepare params data values
    if (payload.fields?.length) params.fields = payload.fields.join(',');

    const response = await payload.$axios({
        method: 'get',
        url: `${ENDPOINTS.PAGES}`,
        params,
    });

    if (!response.data.length) return false;

    return pageSinglePage(response.data[0]);
}

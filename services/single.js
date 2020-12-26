import { ENDPOINTS } from '~/utils/constants';
import { pageSinglePost } from '~/utils/adaptors';

export async function fetchPost(payload) {
    const params = {
        fields: [],
        ...payload
    };

    // prepare params data values
    params.fields.length && ( params.fields = params.fields.join(',') );

    const response = await payload.$axios({
        method: 'get',
        url: `${ENDPOINTS.POSTS}`,
        params
    });

    if (!response.data.length) return false;

    return pageSinglePost(response.data[0]);
}

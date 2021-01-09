import { ENDPOINTS } from './../utils/constants';
import { head } from './../utils/adaptors';

export async function fetchHead(payload) {
    try {
        const response = await payload.$axios({
            method: 'get',
            url: `${ENDPOINTS.HEAD}?url=${payload.url}`
        });

        return head(response.data.head);
    } catch (error) {
        throw error.response;
    }
}

import { ENDPOINTS } from './../utils/constants';
import { pageCategory } from './../utils/adaptors';

export async function fetchCategory(payload) {
    try {
        const response = await payload.$axios({
            method: 'get',
            url: ENDPOINTS.CATEGORIES,
            params: payload.params,
        });

        return pageCategory(response.data[0]);
    } catch (error) {
        throw error.response;
    }
}

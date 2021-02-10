import { ENDPOINTS } from '../utils/constants';

export async function fetchMenu(payload) {
    try {
        const response = await payload.$axios({
            method: 'get',
            url: ENDPOINTS.MENU,
        });

        return response.data;
    } catch (error) {
        throw error.response;
    }
}

import { ENDPOINTS } from '../utils/constants';

const fetchMenu = async (payload) => {
    try {
        const response = await payload.$axios({
            method: 'get',
            url: ENDPOINTS.MENU,
        });

        return response.data;
    } catch (error) {
        throw error.response;
    }
};

export { fetchMenu as default };

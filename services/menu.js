import { ENDPOINTS } from '../utils/constants';
import { menu } from '~/utils/adaptors';

const fetchMenu = async (payload) => {
    try {
        const response = await payload.$axios({
            method: 'get',
            url: ENDPOINTS.MENU,
        });

        return menu(response.data);
    } catch (error) {
        throw error.response;
    }
};

export { fetchMenu as default };

import { ENDPOINTS } from '~/utils/constants';
import { menu } from '~/utils/adaptors';

const fetchMenu = async ({ $axios }) => {
    try {
        const response = await $axios({
            method: 'get',
            url: ENDPOINTS.MENU,
        });

        return menu(response.data);
    } catch (error) {
        throw error.response;
    }
};

export { fetchMenu as default };

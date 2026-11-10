import { ENDPOINTS } from '~/utils/constants';
import { menu } from '~/utils/adaptors';

const fetchMenu = async () => {
    try {
        const response = await $fetch(ENDPOINTS.MENU);

        return menu(response);
    } catch (error) {
        throw error.response;
    }
};

export default fetchMenu;

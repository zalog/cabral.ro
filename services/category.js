import { ENDPOINTS } from '../utils/constants';
import { pageCategory } from '../utils/adaptors';

const fetchCategory = async ({
    $axios,
    params,
}) => {
    try {
        const response = await $axios({
            method: 'get',
            url: ENDPOINTS.CATEGORIES,
            params,
        });

        return pageCategory(response.data);
    } catch (error) {
        throw error.response;
    }
};

export { fetchCategory as default };

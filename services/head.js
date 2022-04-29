import { ENDPOINTS } from '../utils/constants';
import { head } from '../utils/adaptors';

const fetchHead = async ({
    $axios,
    url,
}) => {
    try {
        const response = await $axios({
            method: 'get',
            url: `${ENDPOINTS.HEAD}?url=${url}`,
        });

        return head(response.data.json);
    } catch (error) {
        throw error.response;
    }
};

export { fetchHead as default };

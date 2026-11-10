import { ENDPOINTS } from '../utils/constants';
import { head } from '../utils/adaptors';

const fetchHead = async ({
    url,
}) => {
    try {
        const response = await $fetch(`${ENDPOINTS.HEAD}?url=${url}`);

        return head(response.json);
    } catch (error) {
        throw error.response;
    }
};

export default fetchHead;

import { ENDPOINTS } from '../utils/constants';
import { navCategories } from '../utils/adaptors';

const fetchCategories = async ({
    params,
    fields,
}) => {
    try {
        if (fields) {
            Object.assign(params, {
                ...params,
                _fields: fields.join(','),
            });
        }

        const response = await $fetch(ENDPOINTS.CATEGORIES, {
            query: params,
        });

        return navCategories(response);
    } catch (error) {
        throw error.response;
    }
};

export default fetchCategories;

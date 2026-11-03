import { ENDPOINTS } from '../utils/constants';
import { navCategories } from '../utils/adaptors';

const fetchCategories = async ({
    params,
    fields,
    adaptor,
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

        let adaptorFunction;
        if (adaptor === 'navCategories') adaptorFunction = navCategories;

        return adaptorFunction(response);
    } catch (error) {
        throw error.response;
    }
};

export { fetchCategories as default };

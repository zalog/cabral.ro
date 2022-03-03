import { ENDPOINTS } from '../utils/constants';
import { pageCategory, navCategories } from '../utils/adaptors';

const fetchCategories = async ({
    $axios,
    params,
    adaptor,
}) => {
    try {
        const response = await $axios({
            method: 'get',
            url: ENDPOINTS.CATEGORIES,
            params,
        });

        let adaptorFunction;
        if (adaptor === 'pageCategory') adaptorFunction = pageCategory;
        else if (adaptor === 'navCategories') adaptorFunction = navCategories;

        return adaptorFunction(response.data);
    } catch (error) {
        throw error.response;
    }
};

export { fetchCategories as default };

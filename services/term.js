import { ENDPOINTS } from '../utils/constants';
import { pageTerm } from '../utils/adaptors';
import { notFound } from '../utils';

const fetchTerm = async ({
    taxonomy,
    slug,
}) => {
    let response;

    try {
        response = await $fetch(taxonomy === 'tag' ? ENDPOINTS.TAGS : ENDPOINTS.CATEGORIES, {
            query: {
                slug,
                _fields: 'id,name,description,yoast_head_json',
            },
        });
    } catch (error) {
        throw error.response;
    }

    if (!response.length) throw notFound();

    return pageTerm(response[0]);
};

export { fetchTerm as default };

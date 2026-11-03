import { createError } from '#imports';
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

const fetchTermHead = async ({
    taxonomy,
    slug,
}) => {
    let response;

    try {
        response = await $fetch(taxonomy === 'tag' ? ENDPOINTS.TAGS : ENDPOINTS.CATEGORIES, {
            query: {
                slug,
                _fields: 'yoast_head_json',
            },
        });
    } catch (error) {
        throw error.response;
    }

    if (!response.length) throw createError({ statusCode: 404, statusMessage: 'Nu am găsit pagina', fatal: true });

    return head(response[0].yoast_head_json);
};

export { fetchHead as default, fetchTermHead };

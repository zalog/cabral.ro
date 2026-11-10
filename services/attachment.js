import { ENDPOINTS } from '~/utils/constants';

const fetchAttachment = async ({
    slug,
}) => {
    try {
        const response = await $fetch(ENDPOINTS.MEDIA, {
            query: {
                slug,
                _fields: 'link,source_url',
            },
        });

        return response[0];
    } catch (error) {
        throw error.response;
    }
};

export default fetchAttachment;

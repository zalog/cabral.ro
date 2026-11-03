import {
    createError,
    defineEventHandler,
    getRequestURL,
    getRouterParam,
    setResponseHeader,
    setResponseStatus,
    useRuntimeConfig,
} from '#imports';

const allowedPaths = /^(wp\/v2\/(posts|pages|categories|tags|comments)|yoast\/v1\/get_head|custom\/menu)$/;
const forwardedHeaders = ['x-wp-total', 'x-wp-totalpages', 'x-robots-tag'];

export default defineEventHandler(async (event) => {
    const path = getRouterParam(event, 'path');

    if (!allowedPaths.test(path)) throw createError({ statusCode: 404 });

    const { wpUrl } = useRuntimeConfig(event);
    const response = await $fetch.raw(`${wpUrl}/wp-json/${path}${getRequestURL(event).search}`, {
        ignoreResponseError: true,
    });

    setResponseStatus(event, response.status);
    forwardedHeaders.forEach((name) => {
        const value = response.headers.get(name);
        if (value) setResponseHeader(event, name, value);
    });

    return response._data;
});

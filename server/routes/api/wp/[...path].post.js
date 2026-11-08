import {
    createError,
    defineEventHandler,
    getRequestHeader,
    getRequestIP,
    getRouterParam,
    readRawBody,
    setResponseStatus,
    useRuntimeConfig,
} from '#imports';

const allowedPaths = /^(wp\/v2\/comments|contact-form-7\/v1\/contact-forms\/\d+\/feedback)$/;
// content-type for the body; the others for the spam checks (Akismet)
const forwardedHeaders = ['content-type', 'user-agent', 'referer', 'accept-language'];

export default defineEventHandler(async (event) => {
    const path = getRouterParam(event, 'path');

    if (!allowedPaths.test(path)) throw createError({ statusCode: 404 });

    const headers = new Headers();
    forwardedHeaders.forEach((name) => {
        const value = getRequestHeader(event, name);
        if (value) headers.set(name, value);
    });
    const ip = getRequestIP(event, { xForwardedFor: true });
    if (ip) headers.set('x-forwarded-for', ip);

    const { wpUrl } = useRuntimeConfig(event);
    const response = await $fetch.raw(`${wpUrl}/wp-json/${path}`, {
        method: 'POST',
        headers,
        body: await readRawBody(event, false),
        ignoreResponseError: true,
    });

    setResponseStatus(event, response.status);

    return response._data;
});

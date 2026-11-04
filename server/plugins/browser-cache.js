import { defineNitroPlugin, setResponseHeader } from '#imports';

const isBuildAsset = (event) => event.path.startsWith('/_nuxt/');

export default defineNitroPlugin((nitroApp) => {
    // with these headers removed, the page cache never answers 304, so the browser always gets the current page
    nitroApp.hooks.hook('request', (event) => {
        if (isBuildAsset(event)) return;

        delete event.node.req.headers['if-modified-since'];
        delete event.node.req.headers['if-none-match'];
    });

    nitroApp.hooks.hook('beforeResponse', (event) => {
        if (isBuildAsset(event)) return;

        setResponseHeader(event, 'cache-control', 'no-cache');
    });
});

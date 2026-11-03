import { defineNuxtRouteMiddleware, navigateTo } from '#imports';
import { fetchAttachment } from '~/services';

export default defineNuxtRouteMiddleware(async (to) => {
    const slug = to.params.pathMatch.split('/').filter(Boolean).pop();
    const attachment = await fetchAttachment({ slug });

    if (attachment && new URL(attachment.link).pathname === to.path) {
        return navigateTo(attachment.source_url, { external: true, redirectCode: 301 });
    }
});

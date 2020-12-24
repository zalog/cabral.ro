import { SITE } from '~/utils/constants';

export default (payload) => {
    const payloadDate = new Date(payload.date);
    const payloadModified = new Date(payload.modified);
    const date = ((payloadModified > payloadDate) && payloadModified || payloadDate).toString();
    const categories = payload.embed.categories.map(category => ({
        ...category,
        link: category.link.replace(SITE.LINK, '')
    }));

    const output = {
        excerpt: payload.excerpt.rendered,
        featuredMedia: payload.embed_featured_media.html,
        slug: payload.slug,
        title: payload.title.rendered,
        commentsNumber: payload.comments_number,
        categories,
        date
    };

    return output;
};

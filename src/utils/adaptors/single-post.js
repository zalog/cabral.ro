import { SITE } from './../constants';

export default (payload) => {
    const payloadDate = new Date(payload.date);
    const payloadModified = new Date(payload.modified);
    const date = ((payloadModified > payloadDate) && payloadModified || payloadDate).toString();
    const categories = payload.embed.categories.map(category => ({
        ...category,
        link: category.link.replace(SITE.LINK, '')
    }));
    const featuredMedia = payload.embed_featured_media;
    const featuredMediaRatio = featuredMedia.width / featuredMedia.height;
    const featuredMediaValid = featuredMediaRatio > 1.2 && featuredMedia.width > 1200 && true || false;

    const output = {
        single: {
            id: payload.id,
            link: payload.link,
            featuredMedia: featuredMediaValid && featuredMedia.html || false,
            title: payload.title.rendered,
            content: payload.content,
            commentsNumber: payload.comments_number,
            categories,
            date
        },
        meta: payload.yoast_meta
    };

    return output;
};

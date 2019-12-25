import { SITE } from './../constants';

export default (payload) => {
    const payloadDate = new Date(payload.date);
    const payloadModified = new Date(payload.modified);
    const date = ((payloadModified > payloadDate) && payloadModified || payloadDate).toString();
    const categories = payload.embed.categories.map(category => ({
        ...category,
        link: category.link.replace(SITE.LINK, '')
    }));

    const output = {
        id: payload.id,
        featuredMedia: payload.featured_media,
        title: payload.title.rendered,
        content: payload.content,
        commentsNumber: payload.comments_number,
        categories,
        date
    };

    return output;
};

import { SITE } from '~/utils/constants';
import entityDate from './entity-date';

export default (payload) => {
    const date = entityDate({ date: payload.date, modified: payload.modified });
    const categories = payload.embed.categories.map((category) => ({
        ...category,
        link: category.link.replace(SITE.LINK, ''),
    }));

    return {
        excerpt: payload.excerpt.rendered,
        featuredMedia: payload.embed_featured_media,
        slug: payload.slug,
        title: payload.title.rendered,
        commentsNumber: payload.comments_number,
        categories,
        date,
    };
};

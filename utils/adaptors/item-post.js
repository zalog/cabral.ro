import { SITE } from '~/utils/constants';
import entityDate from './entity-date';
import media from './media';

const itemPost = (payload) => {
    const date = entityDate({ date: payload.date, modified: payload.modified });
    const categories = payload.embed.categories.map((category) => ({
        ...category,
        link: category.link.replace(SITE.LINK, ''),
    }));

    return {
        excerpt: payload.excerpt.rendered,
        featuredMedia: media(payload.embed_featured_media),
        slug: payload.slug,
        title: payload.title.rendered,
        commentsNumber: payload.comments_number,
        categories,
        date,
    };
};

export default itemPost;

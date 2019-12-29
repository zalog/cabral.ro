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

    let related = payload['jetpack-related-posts']
        .filter((post) => {
            return post.img.src !== '';
        });
    if (related.length > 3) related.splice(3);
    related = related.map((post) => {
        let slug = post.url.replace(SITE.LINK, '');
        slug = slug.replace(/\//g, '');

        return {
            title: post.title,
            slug,
            img: post.img.src
        };
    });

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
        meta: payload.yoast_meta,
        related
    };

    return output;
};

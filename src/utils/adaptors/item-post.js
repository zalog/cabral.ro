export default (payload) => {
    const payloadDate = new Date(payload.date);
    const payloadModified = new Date(payload.modified);
    const date = ((payloadModified > payloadDate) && payloadModified || payloadDate).toString();

    const output = {
        excerpt: payload.excerpt.rendered,
        featuredMedia: payload.featured_media,
        slug: payload.slug,
        title: payload.title.rendered,
        commentsNumber: payload.comments_number,
        categories: payload.embed.categories,
        date
    };

    return output;
};

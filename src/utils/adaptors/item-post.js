export default (payload) => ({
    excerpt: payload.excerpt.rendered,
    featuredMedia: payload.featured_media,
    slug: payload.slug,
    title: payload.title.rendered,
    commentsNumber: payload.comments_number
});

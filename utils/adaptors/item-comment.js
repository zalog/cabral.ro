export default (payload) => ({
    commentId: payload.id,
    author: {
        name: payload.author_name,
        url: payload.author_url,
    },
    content: payload.content.rendered,
    date: payload.date,
    status: payload.status,
});

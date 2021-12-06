export default (payload) => ({
    databaseId: payload.id,
    author: {
        node: {
            name: payload.author_name,
            url: payload.author_url,
        },
    },
    content: payload.content.rendered,
    date: payload.date,
    status: payload.status,
});

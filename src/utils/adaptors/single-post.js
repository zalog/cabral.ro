export default (payload) => ({
    id: payload.id,
    title: payload.title.rendered,
    content: payload.content
});

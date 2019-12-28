export default (payload) => {
    const payloadDate = new Date(payload.date);
    const payloadModified = new Date(payload.modified);
    const date = ((payloadModified > payloadDate) && payloadModified || payloadDate).toString();

    const output = {
        single: {
            id: payload.id,
            title: payload.title.rendered,
            content: payload.content,
            commentsNumber: payload.comments_number,
            date
        },
        meta: payload.yoast_meta
    };

    return output;
};

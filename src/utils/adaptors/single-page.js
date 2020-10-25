export default (payload) => {
    const payloadDate = new Date(payload.date);
    const payloadModified = new Date(payload.modified);
    const date = ((payloadModified > payloadDate) && payloadModified || payloadDate).toString();

    const output = {
        single: {
            id: payload.id,
            link: payload.link,
            title: payload.title.rendered,
            content: payload.content,
            commentsNumber: payload.comments_number,
            date
        },
        head: {
            title: payload.title.rendered,
            link: [
                {rel: 'canonical', href: payload.link}
            ],
            meta: payload.yoast_meta
        }
    };

    return output;
};

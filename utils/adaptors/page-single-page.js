import { head } from '.';

export default (payload) => {
    const payloadDate = new Date(payload.date);
    const payloadModified = new Date(payload.modified);
    const date = ((payloadModified > payloadDate && payloadModified) || payloadDate).toString();

    return {
        head: head(payload.yoast_head_json),
        main: {
            id: payload.id,
            link: payload.link,
            title: payload.title.rendered,
            content: payload.content,
            commentsNumber: payload.comments_number,
            date,
        },
    };
};

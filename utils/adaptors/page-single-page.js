import head from './head';
import entityDate from './entity-date';

export default (payload) => {
    const date = entityDate({ date: payload.date, modified: payload.modified });

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

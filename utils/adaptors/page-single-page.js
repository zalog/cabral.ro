import head from './head';
import entityDate from './entity-date';

const pageSinglePage = (payload) => {
    const date = entityDate({ date: payload.date, modified: payload.modified });

    return {
        head: head(payload.yoast_head_json),
        main: {
            id: payload.id,
            link: payload.link,
            title: payload.title.rendered,
            content: payload.content,
            commentsNumber: payload.comments_number,
            commentStatus: payload.comment_status,
            date,
        },
    };
};

export default pageSinglePage;

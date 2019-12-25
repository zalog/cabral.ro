export default (payload) => {
    const output = {
        id: payload.id,
        title: payload.title.rendered,
        content: payload.content,
        commentsNumber: payload.comments_number
    };

    return output;
};

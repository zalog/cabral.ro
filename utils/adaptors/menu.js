const item = ({
    ID, title, url, object,
}) => ({
    ID, title, url, object,
});

export default (payload) => payload.map((payloadItem) => item(payloadItem));

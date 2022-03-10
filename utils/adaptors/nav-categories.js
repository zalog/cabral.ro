import getUrl from './url';

const item = ({
    name, link,
}) => ({
    title: name, to: getUrl(link).pathname,
});

export default (payload) => payload.map((payloadItem) => item(payloadItem));

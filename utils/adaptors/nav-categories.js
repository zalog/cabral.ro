import getUrl from './url';

const item = ({
    name, link,
}) => ({
    title: name, to: getUrl(link).pathname,
});

const navCategories = (payload) => payload.map((payloadItem) => item(payloadItem));

export default navCategories;

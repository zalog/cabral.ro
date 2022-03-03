import getUrl from './url';

const to = ({ url, object }) => {
    const newUrl = getUrl(url);
    let output = newUrl.pathname;

    if (['post', 'page'].includes(object)) {
        output = {
            name: 'Single',
            params: {
                singleSlug: newUrl.pathname.slice(1, -1),
                singleType: object,
            },
        };
    }

    return output;
};

const item = ({
    ID, title, url, object,
}) => ({
    ID, title, to: to({ url, object }),
});

export default (payload) => payload.map((payloadItem) => item(payloadItem));

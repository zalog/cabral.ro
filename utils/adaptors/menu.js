import { SITE } from '~/utils/constants';

const to = ({ url, object }) => {
    const newUrl = new URL(url, SITE.LINK);
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

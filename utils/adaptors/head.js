const objectToString = (object) => Object.values(object).join(', ');

const ogImageProperty = (key) => {
    if (key === 'url') return 'og_image';

    return `og_image:${key}`;
};

const metaKeysName = ['description', 'robots', 'twitter_card', 'twitter_site'];
const metaKeysProperty = ['og_locale', 'og_type', 'og_title', 'og_description', 'og_url', 'og_site_name'];
const metaKeyPropertyOgImage = 'og_image';
const linkKeys = ['canonical'];
const scriptKeySchema = 'schema';

export default (payload) => {
    let title = '';
    const meta = [];
    const link = [];
    const script = [];

    Object.keys(payload).forEach((key) => {
        const value = payload[key];

        if (key === 'title') title = value;
        else if (key === metaKeyPropertyOgImage) {
            value.forEach((item) => {
                Object.keys(item).forEach((itemKey) => {
                    meta.push({
                        property: ogImageProperty(itemKey).replace('_', ':'),
                        content: item[itemKey],
                    });
                });
            });
        } else if (key === scriptKeySchema) {
            script.push({
                type: 'application/ld+json',
                json: value,
                class: 'yoast-schema-graph',
            });
        } else if (metaKeysName.includes(key)) {
            const content = typeof value === 'object'
                ? objectToString(value)
                : value;

            meta.push({
                name: key.replace('_', ':'),
                content,
            });
        } else if (metaKeysProperty.includes(key)) {
            meta.push({
                property: key.replace('_', ':'),
                content: value,
            });
        } else if (linkKeys.includes(key)) {
            link.push({
                rel: key,
                href: value,
            });
        }
    });

    return {
        title,
        meta,
        link,
        script,
    };
};

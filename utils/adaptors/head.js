const objectToString = (object) => Object.values(object).join(', ');

const ogImageProperty = (key) => {
    if (key === 'url') return 'og_image';

    return `og_image:${key}`;
};

const metaKeysName = new Set(['description', 'robots', 'twitter_card', 'twitter_site']);
const metaKeysProperty = new Set(['og_locale', 'og_type', 'og_title', 'og_description', 'og_url', 'og_site_name']);
const metaKeyPropertyOgImage = 'og_image';
const linkKeys = new Set(['canonical']);
const scriptKeySchema = 'schema';

const head = (payload) => {
    let title = '';
    const meta = [];
    const link = [];
    const script = [];

    Object.keys(payload).forEach((key) => {
        const value = payload[key];

        if (key === 'title') title = value;
        else if (key === metaKeyPropertyOgImage) {
            value.forEach((item, index) => {
                Object.keys(item).forEach((itemKey) => {
                    const getOgImageProperty = ogImageProperty(itemKey);

                    meta.push({
                        property: getOgImageProperty.replace('_', ':'),
                        content: item[itemKey],
                        key: `yoast-${key}-${index}-${getOgImageProperty}`,
                    });
                });
            });
        } else if (key === scriptKeySchema) {
            script.push({
                type: 'application/ld+json',
                innerHTML: value,
                class: 'yoast-schema-graph',
                key: `yoast-${key}`,
            });
        } else if (metaKeysName.has(key)) {
            const content = typeof value === 'object'
                ? objectToString(value)
                : value;

            meta.push({
                name: key.replace('_', ':'),
                content,
                key: `yoast-${key}`,
            });
        } else if (metaKeysProperty.has(key)) {
            meta.push({
                property: key.replace('_', ':'),
                content: value,
                key: `yoast-${key}`,
            });
        } else if (linkKeys.has(key)) {
            link.push({
                rel: key,
                href: value,
                key: `yoast-${key}`,
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

export default head;

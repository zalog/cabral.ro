import { SITE } from '~/utils/constants';

const formatDate = (
    string,
    locale = SITE.LANG_REGION,
    format = { year: 'numeric', month: '2-digit', day: '2-digit' },
) => new Date(string).toLocaleString(locale, format);

export { formatDate as default };

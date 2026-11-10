import { SITE } from '~/utils/constants';

const defaultFormat = { year: 'numeric', month: '2-digit', day: '2-digit' };

const formatDate = (
    string,
    locale = SITE.LANG_REGION,
    format = defaultFormat,
) => new Date(string).toLocaleString(locale, format);

export default formatDate;

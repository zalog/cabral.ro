import { SITE } from '~/utils/constants';

const htmlTitleSeparator = ' - ';
const pageTitleSeparator = ' ';

export function formatTitle(title) {
    let output = title;

    if (typeof title === 'string') output = [title];

    return output.join(htmlTitleSeparator);
}

export function formatHtmlTitle(title) {
    if (!title) return SITE.TITLE;

    const output = [formatTitle(title)];

    output.push(SITE.TITLE);

    return output.join(htmlTitleSeparator);
}

export function formatPageTitle(title) {
    if (!title) return undefined;

    return title.replace(htmlTitleSeparator, pageTitleSeparator);
}

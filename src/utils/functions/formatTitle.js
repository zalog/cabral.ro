import { SITE } from './../constants';

const htmlTitleSeparator = ' - ';
const pageTitleSeparator = ' ';

export function formatTitle(title) {
    if (typeof title === 'string') title = [title];

    return title.join(htmlTitleSeparator);
}

export function formatHtmlTitle(title) {
    if (!title) return SITE.TITLE;

    title = [formatTitle(title)];

    title.push(SITE.TITLE);

    return title.join(htmlTitleSeparator);
}

export function formatPageTitle(title) {
    if (!title) return;

    return title.replace(htmlTitleSeparator, pageTitleSeparator);
}

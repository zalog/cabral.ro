import { SITE } from './../constants';

const separator = ' - ';

export function formatTitle(title) {
    if (typeof title === 'string') title = [title];

    return title.join(separator);
}

export function formatHtmlTitle(title) {
    if (!title) return SITE.TITLE;

    title = [formatTitle(title)];

    title.push(SITE.TITLE);

    return title.join(separator);
}

export function formatPageTitle(title) {
    if (!title) return;

    let titleSeparator = ' ';

    return title.replace(separator, titleSeparator);
}

import { SITE } from './../constants';

export function formatHtmlTitle(title) {
    if (!title) return SITE.TITLE;

    const separator = '-';

    if (typeof title === 'string') title = [title];

    title.push(SITE.TITLE);

    return title.reduce((acc, cur) => `${acc} ${separator} ${cur}`);
}

export function formatPageTitle(title) {
    if (!title || !title.length) return;

    const separator = ' ';

    if (typeof title === 'string') title = [title];

    return title.join(separator);
}

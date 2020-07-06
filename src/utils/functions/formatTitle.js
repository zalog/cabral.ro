import { SITE } from './../constants';

export function formatTitle(title) {
    return (title) ? `${title} - ${SITE.TITLE}` : SITE.TITLE;
}

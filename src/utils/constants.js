const HOST = 'https://www.cabral.ro';
const API_HOST = `${HOST}/wp-json/`;

export const ENDPOINTS = {
    GRAPHQL: `${HOST}/graphql`,
    MENU: `${API_HOST}custom/menu`,
    POSTS: `${API_HOST}wp/v2/posts`,
    CATEGORIES: `${API_HOST}wp/v2/categories`,
    PAGES: `${API_HOST}wp/v2/pages`,
    COMMENTS: `${API_HOST}wp/v2/comments`,
    FORM_WPCF7: (id) => `${API_HOST}contact-form-7/v1/contact-forms/${id}/feedback`
};

export const SITE = {
    LANG: 'ro-RO',
    TITLE: 'Cabral.ro',
    LINK: HOST,
    TITLE_TEMPLATE: (title) => (title) ? `${title} - ${SITE.TITLE}` : SITE.TITLE,
    GTM_ID: 'GTM-59M55JB'
};

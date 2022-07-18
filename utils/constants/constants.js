const HOST = 'https://www.cabral.ro';
const API_HOST = `${HOST}/wp-json/`;

export const ENDPOINTS = {
    GRAPHQL: `${HOST}/wordpress/graphql`,
    HEAD: `${API_HOST}yoast/v1/get_head`,
    MENU: `${API_HOST}custom/menu`,
    POSTS: `${API_HOST}wp/v2/posts`,
    CATEGORIES: `${API_HOST}wp/v2/categories`,
    TAGS: `${API_HOST}wp/v2/tags`,
    PAGES: `${API_HOST}wp/v2/pages`,
    COMMENTS: `${API_HOST}wp/v2/comments`,
    FORM_WPCF7: (id) => `${API_HOST}contact-form-7/v1/contact-forms/${id}/feedback`,
};

export const SITE = {
    LANG_REGION: 'ro-RO',
    TITLE: 'Cabral.ro',
    LINK: HOST,
    GTM_ID: 'GTM-59M55JB',
};

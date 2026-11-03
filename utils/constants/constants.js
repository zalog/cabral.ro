const HOST = 'https://www.cabral.ro';
export const WP_HOST = 'https://wp.cabral.ro';
const API = '/api/wp/';
const WP_API = `${WP_HOST}/wp-json/`;

export const ENDPOINTS = {
    HEAD: `${API}yoast/v1/get_head`,
    MENU: `${API}custom/menu`,
    POSTS: `${API}wp/v2/posts`,
    CATEGORIES: `${API}wp/v2/categories`,
    TAGS: `${API}wp/v2/tags`,
    PAGES: `${API}wp/v2/pages`,
    MEDIA: `${API}wp/v2/media`,
    COMMENTS: `${API}wp/v2/comments`,
    COMMENTS_POST: `${WP_API}wp/v2/comments`,
    FORM_WPCF7: (id) => `${WP_API}contact-form-7/v1/contact-forms/${id}/feedback`,
};

export const SITE = {
    LANG_REGION: 'ro-RO',
    TITLE: 'Cabral.ro',
    LINK: HOST,
    GTM_ID: 'GTM-59M55JB',
};

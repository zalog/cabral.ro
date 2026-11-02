import WebFont from 'webfontloader';
import { defineNuxtPlugin } from '#imports';

export default defineNuxtPlugin(() => {
    WebFont.load({
        google: {
            families: ['Merriweather:400,700&display=swap'],
        },
    });
});

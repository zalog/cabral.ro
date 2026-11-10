import { defineNuxtPlugin } from '#imports';
import { SITE } from '~/utils/constants';

const hasDoNotTrack = () => [window.doNotTrack, navigator.doNotTrack, navigator.msDoNotTrack]
    .some((value) => value === '1' || value === 'yes');

const loadGtm = () => {
    if (hasDoNotTrack()) return;

    window.dataLayer.push({ 'gtm.start': Date.now(), 'event': 'gtm.js' });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${SITE.GTM_ID}`;
    document.head.appendChild(script);
};

export default defineNuxtPlugin(() => {
    window.dataLayer = window.dataLayer || [];

    if (!import.meta.dev) setTimeout(loadGtm, 5000);

    return {
        provide: {
            gtm: {
                push: (data) => window.dataLayer.push(data),
            },
        },
    };
});

import { defineNuxtPlugin } from '#imports';

const observers = new WeakMap();

const observe = (el, value) => {
    if (!value) return;

    const { callback, once } = value;
    const observer = new IntersectionObserver(([entry]) => {
        callback(entry.isIntersecting, entry);

        if (once && entry.isIntersecting) observer.disconnect();
    });

    observer.observe(el);
    observers.set(el, observer);
};

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('observe-visibility', {
        mounted: (el, { value }) => observe(el, value),
        unmounted: (el) => observers.get(el)?.disconnect(),
        getSSRProps: () => ({}),
    });
});

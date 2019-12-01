export default function() {
    // if SSR
    if (typeof window === 'undefined') return;

    if (sessionStorage.getItem('fonts')) {
        // If the font had been loaded before active it
        document.documentElement.classList.add('wf-active');
    }

    import('webfontloader').then(WebFontLoader => {
        WebFontLoader.load({
            timeout: 3000,
            google: {
                families: ['Open+Sans', 'Merriweather']
            },
            active: () => {
                sessionStorage.setItem('fonts', true);
            }
        });
    });
}

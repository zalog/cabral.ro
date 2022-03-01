export default ({ app, store }) => {
    Object.assign(app, {
        mounted() {
            store.dispatch('ui/window/attachResizeObserve', {
                el: app.router.app.$el,
            });
            store.dispatch('ui/window/attachScroll');
        },
    });
};

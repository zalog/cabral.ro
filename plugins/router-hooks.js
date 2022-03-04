export default ({ app }) => {
    app.router.afterEach((to) => {
        Object.assign(app.head, {
            bodyAttrs: {
                class: `body-${to.meta.class || to.name.toLowerCase()}`,
            },
        });
    });
};

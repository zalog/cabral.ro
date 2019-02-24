import { createApp } from './app';

export default context => new Promise((resolve, reject) => {
  const { app, router, store } = createApp();

  router.push(context.url);

  router.onReady(() => {
    const matchedComponents = router.getMatchedComponents();
    if (!matchedComponents.length) return reject({ code: 404 });

    context.rendered = () => {
      context.state = store.state;
    };

    resolve(app);
  }, reject);
});
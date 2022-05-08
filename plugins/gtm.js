export default ({ $config, $gtm }) => {
    if ($config.PM2_NODE_ENV !== 'production') return;

    setTimeout(() => {
        $gtm.init();
    }, 5000);
};

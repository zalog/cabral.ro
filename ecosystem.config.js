module.exports = {
    apps: [{
        name: 'cabral.ro-test',
        instances: '1',
        script: './node_modules/nuxt/bin/nuxt.js',
        args: 'start',
        env: {
            HOST: '0.0.0.0',
            PORT: 8081,
            NODE_ENV: 'test',
        },
    }],
};

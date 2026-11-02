module.exports = {
    apps: [
        {
            name: 'cabral.ro',
            script: './.output/server/index.mjs',
            exec_mode: 'cluster',
            instances: 'max',
            env: {
                HOST: '0.0.0.0',
                PORT: 8080,
                NODE_ENV: 'production',
            },
        },
    ],
};

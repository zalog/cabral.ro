module.exports = {
    apps: [{
        name: 'cabral.ro',
        exec_mode: 'cluster',
        instances: 'max', // Or a number of instances
        script: './node_modules/nuxt/bin/nuxt.js',
        args: 'start',
        env: {
            'HOST': '0.0.0.0',
            'PORT': 8080,
            'NODE_ENV': 'production'
        }
    }]
};

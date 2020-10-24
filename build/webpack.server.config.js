const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const base = require('./webpack.base.config');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

module.exports = webpackMerge.merge(base, {
    target: 'node',
    devtool: '#source-map',
    entry: './src/entry-server.js',
    output: {
        filename: 'server-bundle.js',
        libraryTarget: 'commonjs2'
    },
    resolve: {
        alias: {
            'create-api': './create-api-server.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['file-loader', 'vue-style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        new VueSSRServerPlugin()
    ]
});

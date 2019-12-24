const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    mode: isProd ? 'production' : 'development',
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: '[name].[chunkhash].js'
    },
    resolve: {
        alias: {
            'public': path.resolve(__dirname, '../public')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        preserveWhitespace: false
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: ['vue-style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                exclude: path.resolve(__dirname, '../src/assets/icons'),
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.svg$/,
                include: path.resolve(__dirname, '../src/assets/icons'),
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            symbolId: 'icon-[name]'
                        }
                    },
                    'svgo-loader'
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'all',
                    minChunks: 2
                }
            }
        }
    },
    stats: {
        // copied from `'minimal'`
        all: false,
        modules: true,
        maxModules: 0,
        errors: true,
        warnings: true,
        // additional options
        moduleTrace: true,
        errorDetails: true,
        assets: true
    },
    devServer: {
        stats: 'normal'
    },
    devtool: isProd ? false : 'cheap-module-eval-source-map',
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: isProd ? '[name].[chunkhash].css' : '[name].css',
            chunkFilename: isProd ? '[name].[chunkhash].css' : '[name].css'
        })
    ]
};

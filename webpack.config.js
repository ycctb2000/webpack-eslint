var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
//var ExtractPlugin = require('extract-text-webpack-plugin');

var production = process.env.NODE_ENV === 'production';

var plugins = [
    //new ExtractPlugin('bundle.css'),
    new webpack.optimize.CommonsChunkPlugin({
        // Move dependencies to our main file
        name: 'main',

        // Look for common dependencies in all children,
        children: true,

        // How many times a dependency must come up before being extracted
        minChunks: 2
    })
];

if (production) {
    plugins = plugins.concat([
        // Cleanup the builds/ folder before
        // compiling our final assets
        new CleanPlugin('builds'),

        // This plugin looks for similar chunks and files
        // and merges them for better caching by the user
        new webpack.optimize.DedupePlugin(),

        // This plugins optimizes chunks and modules by
        // how much they are used in your app
        new webpack.optimize.OccurenceOrderPlugin(),

        // This plugin prevents Webpack from creating chunks
        // that would be too small to be worth loading separately
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 51200, // ~50kb
        }),

        // This plugin minifies all the Javascript code of the final bundle
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
                warnings: false, // Suppress uglification warnings
            },
        }),

        // This plugins defines various variables that we can set to false
        // in production to avoid code related to them from being compiled
        // in our final bundle
        new webpack.DefinePlugin({
            __SERVER__: !production,
            __DEVELOPMENT__: !production,
            __DEVTOOLS__: !production,
            'process.env': {
                BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        })
    ]);
}

module.exports = {
    debug: !production,
    entry: './src',
    output: {
        path: 'builds',
        filename: 'bundle.js',
        chunkFilename: '[name]-[chunkhash].js',
        publicPath: 'builds/'
    },
    plugins: plugins,
    module: {
        preLoaders: [{
            test: /\.jsx?$/,
            loader: 'eslint',
        }],
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                presets: ['es2015']
            }
        }, {
            test: /\.scss$/,
            loader: 'style!css!sass'
            //loader:ExtractPlugin.extract('style', 'css!sass')
        }, {
            test: /\.html$/,
            loader: 'html'
        }, {
            test: /\.(png|gif|jpe?g|svg)$/i,
            loader: 'url',
            query: {
                limit: 10, // 10kb
            }
        }]
    }
};
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlReplaceWebpackPlugin from 'html-replace-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

require('dotenv').config();

const config = require('./config.json');

const isProduction = process.env.NODE_ENV === 'production';
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src/index.html'),
    filename: 'index.html',
    inject: 'body',
    minify: {
        collapseWhitespace: true,
        preserveLineBreaks: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
    },
    robots: isProduction ? 'index, follow' : 'noindex, nofollow',
});
const MiniCssExtractPluginConfig = new MiniCssExtractPlugin({
    filename: '[name].[hash].css',
    chunkFilename: '[id].[hash].css',
});
const CopyWebpackPluginConfig = new CopyWebpackPlugin([
    {
        from: config.public.images,
        to: 'images',
    },
]);
const HtmlReplaceWebpackPluginConfig = new HtmlReplaceWebpackPlugin([
    {
        pattern: config.public.images,
        replacement: 'images/',
    },
]);
const ImageminPluginConfig = new ImageminPlugin({
    disable: !isProduction,
    context: 'src',
    destination: path.resolve(__dirname, config.output.dir),
    gifsicle: {
        optimizationLevel: 3,
        interlaced: true,
        colors: 10,
    },
    mozjpeg: {
        progressive: true,
        quality: 90,
    },
    pngquant: {
        speed: 1,
        quality: 90,
    },
    svgo: {plugins: [{removeViewBox: false}, {cleanupIDs: true}]},
    webp: {quality: 90},
});
const plugins = [
    MiniCssExtractPluginConfig,
    HtmlWebpackPluginConfig,
    CopyWebpackPluginConfig,
    HtmlReplaceWebpackPluginConfig,
    ImageminPluginConfig,
];

module.exports = () => ({
    entry: config.entry,
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, config.output.dir),
        publicPath: '/',
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    name: 'vendor',
                    enforce: true,
                },
            },
        },
    },
    plugins,
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {'react-dom': '@hot-loader/react-dom'},
    },
    devServer: {
        contentBase: path.resolve(__dirname, config.output.dir),
        historyApiFallback: true,
        noInfo: true,
        port: process.env.WEBPACK_PORT || 3010,
        stats: 'errors-only',
        hot: true,
    },
    devtool: !isProduction ? 'cheap-module-eval-source-map' : '',
    context: __dirname,
    module: {
        rules: [
            {
                test: /\.js(x)?$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules|vendor/,
                use: [{loader: 'babel-loader?cacheDirectory'}, {loader: 'eslint-loader'}],
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules|vendor/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {hmr: !isProduction},
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'local',
                                localIdentName: !isProduction ? '[name]-[local]--[hash:base64:6]' : '[hash:base64:8]',
                                context: path.resolve(__dirname, 'src'),
                            },
                            sourceMap: !isProduction,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {sourceMap: 'inline'},
                    },
                ],
            },
            {
                test: /\.(gif|png|jpe?g|webp)$/i,
                exclude: /node_modules|vendor/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {name: 'images/[hash:base64:8].[ext]'},
                    },
                ],
            },
            {
                test: /\.svg$/,
                exclude: /node_modules|vendor/,
                use: ['@svgr/webpack'],
            },
            {
                test: /\.(woff|woff2)/,
                exclude: /node_modules|vendor/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {name: 'fonts/[hash:base64:8].[ext]'},
                    },
                ],
            },
        ],
    },
});

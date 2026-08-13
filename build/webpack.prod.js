// webpack.config.js
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// const { CycloneDxWebpackPlugin } = require('@cyclonedx/webpack-plugin');
// const pkg = require('../package.json');
// const prodDeps = Object.keys(pkg.dependencies || {});

module.exports = merge(commonConfig, {
    mode: 'production',
    // devtool: 'source-map',
    plugins: [
        // new CycloneDxWebpackPlugin({
        //     specVersion: '1.6',
        //     outputLocation: './dependencies',
        //     includeWellknown: false,
        //     componentFilter: (component) => {
        //         return prodDeps.includes(component.name);
        //     }
        // }),
        new CopyPlugin({
            patterns: [
                { from: 'assets', to: 'assets' },
                {
                    from: 'node_modules/@jam/jam-ui/dist/jam-ui.js',
                    to: 'assets/lib/'
                },
                // jam-cc 自定义模板
                {
                    from: 'node_modules/@jam/jam-cc/dist',
                    to: 'assets/cc/'
                },
                // jam-map-util 地图
                {
                    from: 'node_modules/@jam/jam-map-util/assets',
                    to: 'assets/'
                },
                {
                    from: 'node_modules/@jam/jam-map-util/dist/jam-map-util.mjs',
                    to: 'assets/lib/'
                },
                {
                    from: 'node_modules/@jam/nusp/dist',
                    to: 'assets/lib/'
                },
                // 高级主题文件
                {
                    from: 'node_modules/@jam/advanced-themes/dist',
                    to: 'assets/themes/'
                },
                {
                    from: 'node_modules/@jam/advanced-styles/dist',
                    to: 'assets/lib/'
                }
                // input-code 按需引入
                // {
                //     from: 'node_modules/@jam/input-code/dist/jam-input-code.js',
                //     to: 'assets/lib/'
                // }
                // render-util 按需引入
                //    {
                //     from: 'node_modules/@jam/render-util/dist/',
                //     to: 'assets/lib/'
                // }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name]_[chunkhash:8].css'
        }),
        new HtmlWebpackPlugin({
            title: '省级平台',
            template: 'src/index.html',
            inject: 'body',
            chunks: ['index'],
            scriptLoading: 'blocking',
            scripts: ['assets/lib/jam-ui.js', 'assets/lib/http.js', 'assets/lib/jam-styles.js', 'assets/lib/jam-nusp.js', 'assets/lib/jam-cc.js', 'assets/lib/polyfill.js', 'assets/lib/message.min.js']
        })
    ],
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin({
                exclude: 'assets',
                parallel: true, // 开启多线程压缩
                terserOptions: {
                    compress: {
                        pure_funcs: ['console.log'] // 删除console.log
                    }
                }
            })
        ]
        // minimize: false
    },
    output: {
        filename: 'js/[name]_[chunkhash:8].js',
        path: path.resolve(__dirname, '../jaml-province-fe')
    },
    module: {
        rules: [
            {
                test: /\.(svg|png|jpg|jpeg|gif)$/,
                generator: {
                    filename: 'images/[name]_[hash:8][ext]'
                }
            }
        ]
    }
});

const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(commonConfig, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    output: {
        filename: '[name]_[contenthash].js'
    },
    devServer: {
        port: 3333,
        open: false,
        compress: false, // gzip压缩,开发环境不开启,提升热更新速度
        hot: false, // 开启热更新，后面会讲react模块热替换具体配置
        // devMiddleware: {
        //     writeToDisk: true // 将生成的文件写入磁盘 按需自取
        // },
        static: [
            {
                directory: path.join(__dirname, '../assets'), // 托管静态资源assets
                publicPath: '/assets'
            },
            {
                directory: path.join(__dirname, '../node_modules/@jam/jam-ui/dist'), // 引入jam-ui
                publicPath: '/assets/lib/',
                watch: { ignored: '**/*.d.ts' }
            },
            // 引入jam-cc 自定义模板
            {
                directory: path.join(__dirname, '../node_modules/@jam/jam-cc/dist'),
                publicPath: '/assets/cc/'
            },
            // jam-map-util 地图 按需引入
            {
                directory: path.join(__dirname, '../node_modules/@jam/jam-map-util/assets'), // 地图geo文件
                publicPath: '/assets'
            },
            {
                directory: path.join(__dirname, '../node_modules/@jam/jam-map-util/dist'), // 地图代码
                publicPath: '/assets/lib'
            },
            {
                directory: path.join(__dirname, '../node_modules/@jam/nusp/dist'), // nusp
                publicPath: '/assets/lib/'
            },
            {
                directory: path.join(__dirname, '../node_modules/@jam/advanced-themes/dist'), // 高级主题文件
                publicPath: '/assets/themes/'
            },
            {
                directory: path.join(__dirname, '../node_modules/@jam/advanced-styles/dist'), // 高级主题文件
                publicPath: '/assets/lib/'
            }
            // input-code 按需引入
            // {
            //     directory: path.join(__dirname, '../node_modules/@jam/input-code/dist'),
            //     publicPath: '/assets/lib/'
            // }
            // render-util 按需引入
            //   {
            //     directory: path.join(__dirname, '../node_modules/@jam/render-util/dist'),
            //     publicPath: '/assets/lib/'
            // }
        ]
    },
    plugins: [
        // 分析打包体积按需加入
        // new BundleAnalyzerPlugin({
        //     analyzerPort: 2223,
        //     openAnalyzer: false,
        //     logLevel: 'info'
        // }),
        new HtmlWebpackPlugin({
            title: '省级平台',
            template: 'src/index.html',
            inject: 'body',
            chunks: ['index'],
            scriptLoading: 'blocking',
            scripts: ['assets/lib/jam-ui.js', 'assets/lib/http.js', 'assets/lib/jam-styles.js', 'assets/cc/jam-cc-all.js', 'assets/lib/polyfill.js', 'assets/lib/message.min.js', 'assets/lib/jam-nusp.js']
        })
    ]
});

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

// 用正则提取文档中第一个JSDoc，分析其中元数据
const JSDOC_PATTERN = /^\s*\/\*.*?\*\//gs;
const META_PATTERN = /@(\w+)\s+(\S+)/gs;
function getMetaData(content) {
    const metaDoc = content.match(JSDOC_PATTERN);
    if (!metaDoc) {
        return {};
    }
    const metaDatas = Array.from(metaDoc[0].matchAll(META_PATTERN)).reduce((res, val) => {
        res[val[1]] = val[2];
        return res;
    }, {});
    return metaDatas;
}
// 处理mjs
let allComponents = [];
const entry = { index: { import: './src/index.js' } };
function fileReader(pathName) {
    fs.readdirSync(path.join(__dirname, `../src/${pathName}`)).forEach(function (_fileName) {
        console.log(_fileName);
        if (_fileName.endsWith('.mjs') || _fileName.endsWith('.js')) {
            let _name = _fileName.split('.')[0];
            const _entryName = `${pathName}/${_name}`;
            entry[_entryName] = {
                import: `./src/${pathName}/${_fileName}`,
                library: {
                    type: 'module'
                },
                filename: `${_entryName}.mjs`
            };
            // 导出所有需要注册的卡片路径
            if (_fileName.endsWith('.mjs') && pathName.includes('registerCards')) {
                const _f = fs.readFileSync(path.resolve(`./src/${pathName}/${_fileName}`), { encoding: 'utf-8' });
                const _meta = getMetaData(_f);
                // cap 和 icon 为必填元数据
                if (!_meta.cap || !_meta.icon) {
                    return;
                }
                allComponents.push({ ..._meta, path: `${_entryName}.mjs` });
            }
        } else {
            let _stat = fs.statSync(path.join(__dirname, `../src/${pathName}/${_fileName}`));
            if (_stat.isDirectory()) {
                fileReader(`${pathName}/${_fileName}`);
            }
        }
    });
}
fileReader('modules');
console.log('entry', entry);

module.exports = {
    entry: entry,
    externals: {
        '@jam/jam-ui': 'jam' // 外部依赖
    },
    externalsType: 'global', // 在module状态下，把
    plugins: [
        new CleanWebpackPlugin(),
        // 项目内使用模式 DEVELOPMENT_MODE:true/false NODE_ENV:development|test|production
        new webpack.DefinePlugin({
            DEVELOPMENT_MODE: isDev,
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            BASE_ENV: JSON.stringify(process.env.BASE_ENV),
            ALL_COMPONENTS: JSON.stringify(allComponents)
        }),
        require('autoprefixer')
    ],
    experiments: {
        outputModule: true
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            {
                test: /\.json$/,
                type: 'json'
            },
            {
                test: /\.js|jsx$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        //后缀名自动补全，引入时可不必写后缀名
        extensions: ['.js', '.mjs']
    }
};

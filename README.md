## 项目准备

1. 安装依赖
   npm install
2. 引入
   有 jam-ui 源码的执行 `npm run link`
   无 jam-ui 源码的执行 `npm run updatejam`

3. 全局替换
   jaml-province-fe 一键替换 项目名称

4. webpack.dev.js
   devServer 项目启动端口号按照需求调整
   BundleAnalyzerPlugin 打包分析器，需要的话放开，并调整端口号
   HtmlWebpackPlugin title 模版项目 替换 项目名称

5. webpack.prod.js
   HtmlWebpackPlugin title 模版项目 替换 项目名称

## 使用类型 input-code

1. index.html 中放开 jam-input-code.js 注释
2. webpack.dev.js 中放开 input-code 注释
3. webpack.prod.js 中放开 input-code 注释

## 使用 地图

1. webpack.dev.js 中放开 jam-map-util 注释 2 部分
2. webpack.prod.js 中放开 jam-map-util 注释 2 部分
3. index.js 中国呢放开地图相关注释，2 行

## 非新一代项目

1. index.js 中 新一代项目删除
2. index.html 中 最后 2 个 js 删除
3. conf 里面 jam_scada_shortcuts.json 删除
4. conf/config.json 中 service 部分删除

## 新一代项目

1. 最后打包成品如果是三区的 webpack.prod.js 中 chttp=>http

## 项目命令

启动 npm run start
打包 npm run build
更新 jam npm run updatejam

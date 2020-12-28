const path = require('path')
module.exports = {
    publicPath: './',
    productionSourceMap: false,

    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'sass',
            patterns: [
                path.resolve(__dirname, './src/assets/styles/*.scss')      //你的.scss文件所在目录
            ]
        }
    },
    devServer: {
        proxy: {
            // 设置代理
            // proxy all requests starting with /api to jsonplaceholder
            '/api': {
                target: 'https://www.xueshu.work/main',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
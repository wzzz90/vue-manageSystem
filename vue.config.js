
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  // 修改的配置
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  devServer: {
    open: false,
    host: 'localhost',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: { // 配置跨域
        '/api': {
            target: 'http://localhost:5000/api/',
            ws: true,
            changOrigin: true,
            pathRewrite: {
                '^/api': ''
            }
        }
    },
    before: app => { }
  },
  chainWebpack: (config) => {
    /* 添加分析工具*/
    if (process.env.NODE_ENV === 'production') {
        if (process.env.npm_config_report) {
            config
                .plugin('webpack-bundle-analyzer')
                .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
                .end();
            config.plugins.delete('prefetch')
        }
    } 
  },

  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
        // 为生产环境修改配置...
        config.mode = 'production'
        return {
            plugins: [new CompressionPlugin({
                test: /\.js$|\.html$|\.css/, //匹配文件名
                threshold: 10240, //对超过10k的数据进行压缩
                deleteOriginalAssets: false //是否删除原文件
            })]
        }
    } 
  },

  // configureWebpack: {
  //   externals: {
  //     'vue': 'Vue',
  //     'vue-router': 'VueRouter',
  //   }
  // }
}
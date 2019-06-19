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
  }
}
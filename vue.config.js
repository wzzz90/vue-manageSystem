module.exports = {
  // 修改的配置
  // 将baseUrl: '/api',改为baseUrl: '/',
  baseUrl: '/',
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
}
}
const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = function (app) {
  app.use(
    /**
     * 如果设置为"^/api": "",则发送应为http://localhost:5000/api/manager/register，服务收到为http://localhost:4000/manager/register
     */
    createProxyMiddleware('/api', {
      target: 'http://192.168.64.91:8080', //服务器接口地址
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    })
  )
}

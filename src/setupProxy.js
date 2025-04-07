const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    // app.use(
    //     '/api',
    //     createProxyMiddleware({
    //         target: 'http://localhost:13000/',
    //         changeOrigin: true,
    //     })
    // );
    //
    // app.use(
    //     '/socket.io',
    //     createProxyMiddleware({
    //         target: 'http://localhost:13000/socket.io/',
    //         ws: true,
    //         changeOrigin: true,
    //     })
    // );
    //
    // app.use(
    //     '/ws',
    //     createProxyMiddleware({
    //         target: 'ws://localhost:13000/ws',
    //         ws: true,
    //         changeOrigin: true,
    //     })
    // );
    //
    // app.use(
    //     '/avatar',
    //     createProxyMiddleware({
    //         target: 'http://localhost:13000/statics/avatar',
    //         changeOrigin: true,
    //     })
    // );
};

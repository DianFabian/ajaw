const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://ws.synchroteam.com',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/v3',
            },
        })
    );
};

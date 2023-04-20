import type { Express } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const clientId = 'qqlv6juxtdx29n2x1w1lh5bxs0h6pv';
// const appSecret = '2cclv68wevphfbo1aiovcw56ie5msh';

export default function (app: Express): void {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://api.igdb.com',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/v4',
            },
            onProxyReq: (proxyReq, req) => {
                const accessToken = req.headers['x-access-token'];
                if (accessToken) {
                    proxyReq.setHeader('Authorization', `Bearer ${accessToken}`);
                }
                proxyReq.setHeader('Client-ID', clientId || '');
            },
        }),
    );
}

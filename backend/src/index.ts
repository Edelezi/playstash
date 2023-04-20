import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
// import { wishlistRouter } from './wishlist';
import { authenticateJWT } from './middleware';
// import { authRouter } from './auth/index';

const clientId = 'qqlv6juxtdx29n2x1w1lh5bxs0h6pv';
const appSecret = '2cclv68wevphfbo1aiovcw56ie5msh';

const app = express();

app.use(cors()); // Add this line to enable CORS
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Protect this route with JWT authentication
app.get('/wishlist', authenticateJWT, (req, res) => {
    res.send('Your wishlist will be here');
});

// app.use('/auth', authRouter);
// app.use('/wishlist', authenticateJWT, wishlistRouter);

app.use(
    '/api',
    createProxyMiddleware({
        target: 'https://api.igdb.com',
        changeOrigin: true,
        pathRewrite: {
            '^/api': '/v4',
        },
        onProxyReq: (proxyReq, req) => {
            console.log('req.headers', req.headers);
            const accessToken = req.headers['x-access-token'];
            console.log('accessToken', accessToken);
            if (accessToken) {
                proxyReq.setHeader('Authorization', `Bearer ${accessToken}`);
            }
            proxyReq.setHeader('Client-ID', clientId || '');
        },
    }),
);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

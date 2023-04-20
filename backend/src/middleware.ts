

// Middleware for protecting routes
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            if (decoded && typeof decoded === 'object') {
                req.body.userId = decoded.userId;
            }
            next();
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
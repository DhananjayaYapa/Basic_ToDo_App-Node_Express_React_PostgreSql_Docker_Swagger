import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './errorHandler.js';

export interface JwtPayload {
    userId: number;
    email: string;
    name: string;
}

//Authentication Middleware
export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
    try {
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is required');
        }

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedError('No authorization token provided');
        }

        const parts = authHeader.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new UnauthorizedError('Invalid authorization header format. Use: Bearer <token>');
        }

        const token = parts[1];
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            name: decoded.name,
        };

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(new UnauthorizedError('Token has expired'));
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new UnauthorizedError('Invalid token'));
        }
        next(error);
    }
};

//Generate JWT Token
export const generateToken = (user: { id: number; email: string; name: string }): string => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error('JWT_SECRET environment variable is required');
    }

    const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
    };

    return jwt.sign(payload, jwtSecret, {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'],
    });
};

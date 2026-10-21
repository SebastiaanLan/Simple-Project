import jwt from 'jsonwebtoken';

import User from '../models/User.js';

import logger from '../util/logger.js';
import { cookieOptions } from '../util/cookies.js';

const userLogger = logger.child({ module: 'auth' });

export const validateToken = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            userLogger.info("No token");
            res.clearCookie('token', cookieOptions);
            return res.status(401).json({
                message: 'Not logged in'
            })
        }

        let user = jwt.verify(token, process.env.JWT_SECRET);

        user = await User.findByPk(user.id);
        
        if (!user) {
            userLogger.info("No user found");
            res.clearCookie('token', cookieOptions);
            return res.status(401).json({
                message: 'Not logged in'
            })
        }

        req.user = user;
        next();
    } catch (err) {
        userLogger.error(err);
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            userLogger.warn("Unauthorized action");
            return res.status(403).json({
                message: 'You are not allowed to do that'
            })
        }

        next();
    } catch (err) {
        userLogger.error(err);
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}
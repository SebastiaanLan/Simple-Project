import jwt from 'jsonwebtoken';

import logger from '../logger.js';

import { cookieOptions } from '../controllers/usercontroller.js';

const userLogger = logger.child({ module: 'auth' });

export const cookieAuth = (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            userLogger.info("No token");
            res.clearCookie('token', cookieOptions);
            return res.status(401).json({
                message: 'Not logged in'
            })
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);

        req.user = user;
        next();
    } catch (err) {
        userLogger.error(err);
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

export default cookieAuth;
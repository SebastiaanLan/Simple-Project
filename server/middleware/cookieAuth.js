import jwt from 'jsonwebtoken';

import { cookieOptions } from '../controllers/usercontroller.js';

export const cookieAuth = (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            res.clearCookie('token', cookieOptions);
            return res.status(401).json({
                message: 'Not logged in'
            })
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);

        req.user = user;
        next();
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

export default cookieAuth;
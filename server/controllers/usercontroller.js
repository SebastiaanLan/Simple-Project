import { matchedData } from 'express-validator';
import bcrypt from 'bcrypt';

import User from '../models/User.js';

import logger from '../util/logger.js';
import { setAuthCookie, cookieOptions } from '../util/cookies.js';

const saltRounds = 10;
const DUMMY_HASH = "$2b$10$3T5OJkCuDMyu5nFA.3MrJejSIVfkkBjU5qrqKOo/lZfRH1KgIW42u";

const userLogger = logger.child({ module: 'auth' });

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'phone', 'role', 'avatar'],
        });

        userLogger.info("Sent all the Users");
        res.status(200).json(users);
    } catch(err) {
        userLogger.error(err);
        res.status(500).json({ message: "Something went wrong"});
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = matchedData(req);

        const user = await User.findOne({ where: { email } });

        const hash = user ? user.password : DUMMY_HASH;
        const passwordCheck = await bcrypt.compare(password, hash);

        if (!user || !passwordCheck) {
            return res.status(401).json({ message: 'Invalid Login' });
        }

        setAuthCookie(res, user);

        userLogger.info('User logged in successfully');
        return res.status(200).json({ 
            id: user.id, 
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar
        });
    } catch (err) {
        userLogger.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('token', cookieOptions);

        userLogger.info('User loggedout in successfully');
        res.status(200).json({ message: "Logout sucessful" })
    } catch (err) {
        userLogger.error(err);
        res.status(500).josn({ message: "Something went wrong" })
    }
}

export const register = async (req, res) => {
    try {
        const { name, email, phone, password } = matchedData(req);
        
        const hash = await bcrypt.hash(password, saltRounds);
        const user = await User.create({ name, email, phone, password: hash });

        setAuthCookie(res, user);

        userLogger.info("User registered");
        return res.status(201).json({ 
            id: user.id, 
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar
        });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Email already in use' });
        }
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Some information is not valid' })
        }

        userLogger.error(err);
        res.status(500).json({ message: "Something went wrong"});   
    }
}

export const deleteUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.destroy();

        userLogger.info("Deleted a user");
        res.status(204).end();
    } catch (err) {
        userLogger.error(err);
        res.status(500).json({ message: "Something went wrong"});   
    }
}

export const updateUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const data = matchedData(req, { locations: ['body'] });
        
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.update(data);
        
        userLogger.info("Updated a user");
        return res.status(200).json({ 
            id: user.id, 
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar
        });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Email already in use' });
        }
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Some information is not valid' })
        }

        userLogger.error(err);
        res.status(500).json({ message: "Something went wrong"});   
    }
}

export const updateUserAdmin = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const data = matchedData(req, { locations: ['body'] });

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        await user.update(data);
        
        userLogger.info("Updated a user");
        return res.status(200).json({ 
            id: user.id, 
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar
        });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Email already in use' });
        }
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Some information is not valid' })
        }

        userLogger.error(err);
        return res.status(500).json({ message: 'Something went wrong' })
    }
}

export const me = async (req, res) => {
    try {
        const user = req.user;
        
        return res.status(200).json({ 
            id: user.id, 
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar
        });
    } catch (err) {
        userLogger.error(err);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}
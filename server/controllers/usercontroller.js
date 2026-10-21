import { matchedData } from 'express-validator';
import bcrypt from 'bcrypt';

import User from '../models/User.js';

import logger from '../util/logger.js';
import { setAuthCookie, cookieOptions } from '../util/cookies.js';
import normalizePhone from '../util/phone.js';

const saltRounds = 10;
const DUMMY_HASH = "$2b$10$3T5OJkCuDMyu5nFA.3MrJejSIVfkkBjU5qrqKOo/lZfRH1KgIW42u";

const userLogger = logger.child({ module: 'auth' });

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'phone', 'role'],
        });

        userLogger.info("Sent all the Users");
        res.status(200).json(users);
    } catch(err) {
        userLogger.error(err);
        res.status(500).json({ message: "Something went wrong"});
    }
}

export const getOneUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const user = await User.findByPk(id, {
            attributes: ['id', 'name', 'email', 'phone'],
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        userLogger.info("Send one user");
        res.status(200).json(user);
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
        res.status(200).json({ message: 'Login successful' })
    } catch (err) {
        userLogger.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('token', cookieOptions);

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
        res.status(201).json({ id: user.id, name: user.name, phone: user.phone, email: user.email});
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
        let { name, email, phone, password } = req.body;

        if (![name, email, phone, password].every(v => typeof v === 'string' && v.trim())) {
            return res.status(400).json({ message: 'name, email, phone and password are required' });
        }

        const id = Number(req.params.id);
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const normalizedPhone = normalizePhone(phone);

        if (!normalizedPhone) {
            return res.status(400).json({ message: 'Invalid phone number' })
        }

        const hash = await bcrypt.hash(password, saltRounds);
        await user.update({ 
            name: name.trim(), 
            email: email.trim().toLowerCase(), 
            phone: normalizedPhone, 
            password: hash 
        });

        userLogger.info("Updated a user");
        res.status(200).json({ id: user.id, name: user.name, email: user.email, phone: user.phone });
        
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

export const me = async (req, res) => {
    try {
        const user = req.user

        return res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        })
        
    } catch (err) {
        userLogger.error(err);

        return res.status(500).json({
            message: 'Something went wrong'
        });
        
    }
}

export const changeUserRole = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { role } = matchedData(req);

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (user.role === role) {
            return res.status(200).json({
                message: 'User already has this role',
            })
        }

        await user.update({ role });
        
        userLogger.info(`The role for a user has been set to ${user.role}`)
        return res.status(200).json({
            message: "User role updated"
        })
    } catch (err) {
        userLogger.error(err);

        return res.status(500).json({
            message: 'Something went wrong'
        })
    }
}
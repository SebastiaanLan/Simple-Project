import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

import User from '../models/User.js';

const saltRounds = 10;
const DUMMY_HASH = "$2b$10$3T5OJkCuDMyu5nFA.3MrJejSIVfkkBjU5qrqKOo/lZfRH1KgIW42u";

export const cookieOptions = {
    httpOnly: true,
}

const setAuthCookie = (res, user) => {
    const token = jwt.sign({ id:user.id , username: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {...cookieOptions, maxAge: 60 * 60 * 1000});
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email'],
        });

        console.log("Sent all the Users");
        res.status(200).json(users);
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong"});
    }
}

export const getOneUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const user = await User.findByPk(id, {
            attributes: ['id', 'name', 'email'],
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Send one user");
        res.status(200).json(user);
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong"});
    }
}

export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase();

        if (!email | !password) {
            return res.status(400).json({ message: 'email and password are required' });
        }

        const user = await User.findOne({ where: { email } });
        const hash = user ? user.password : DUMMY_HASH;
        const passwordCheck = await bcrypt.compare(password, hash);

        if (!user || !passwordCheck) {
            return res.status(401).json({ message: 'Invalid Login' });
        }

        setAuthCookie(res, user);

        console.log('User logged in successfully');
        res.status(200).json({ message: 'Login succesful' })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const register = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        email = String(email).toLowerCase();

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'name, email and password are required' });
        }
        
        const hash = await bcrypt.hash(password, saltRounds);
        const user = await User.create({ name, email, password: hash });

        setAuthCookie(res, user);

        console.log("User registered");
        res.status(201).json({ id: user.id, name: user.name, email: user.email});
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            console.log("User tried to update to a email already in use");
            return res.status(409).json({ message: 'Email already in use' });
        }

        console.log(err);
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

        console.log("Deleted a user");
        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong"});   
    }
}

export const updateUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        email = email.toLowerCase();

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'name, email and password are required' });
        }

        const id = Number(req.params.id);
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Something went wrong" });
        }

        const hash = await bcrypt.hash(password, saltRounds);
        await user.update({ name, email, password: hash });

        console.log("Updated a user");
        res.status(201).json({ id: user.id, name: user.name, email: user.email });
        
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            console.log("User tried to update to a email already in use");
            return res.status(409).json({ message: 'Email already in use' });
        }

        console.log(err);
        res.status(500).json({ message: "Something went wrong"});   
    }
}
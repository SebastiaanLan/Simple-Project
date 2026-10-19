import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong"});
    }
}

export const getOneUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong"});
    }
}

export const addUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'name, email and password are required' });
        }

        const user = await User.create({ name, email, password });

        res.status(201).json(user);

    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
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

        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong"});   
    }
}

export const updateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'name, email and password are required' });
        }

        const id = Number(req.params.id);
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Something went wrong" });
        }

        await user.update({ name, email, password });

        res.status(201).json(user);
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong"});   
    }
}
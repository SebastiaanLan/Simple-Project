import Router from 'express';

import { getAllUsers, getOneUser, addUser, deleteUser, updateUser } from '../controllers/usercontroller.js';

const router = Router();

export let users = ['Sebastiaan', "Rick", "Mike", "Robert"];

router.get('/users', getAllUsers);
router.get('/users/:id', getOneUser);
router.post('/users', addUser)
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser)

export default router;
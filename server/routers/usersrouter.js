import Router from 'express';

import { getAllUsers, getOneUser, register, login, deleteUser, updateUser } from '../controllers/usercontroller.js';

import cookieAuth from '../middleware/cookieAuth.js';

import validate from '../middleware/validate.js';
import { registerRules, loginRules } from '../validators/user.js';


const router = Router();

router.get('/users', getAllUsers);
router.get('/users/:id', getOneUser);
router.post('/login', loginRules, validate, login);
router.post('/register', registerRules, validate, register);
router.delete('/users/:id', cookieAuth, deleteUser);
router.put('/users/:id', cookieAuth, updateUser)

export default router;
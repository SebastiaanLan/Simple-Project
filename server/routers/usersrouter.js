import Router from 'express';

import { getAllUsers, getOneUser, register, login, deleteUser, updateUser, me, logout, changeUserRole } from '../controllers/usercontroller.js';

import { isAdmin, validateToken } from '../middleware/auth.js';

import validate from '../middleware/validate.js';
import { registerRules, loginRules, changeUserRules } from '../validators/user.js';


const router = Router();

router.post('/login', loginRules, validate, login);
router.post('/logout', logout);
router.post('/register', registerRules, validate, register);
router.get('/me', validateToken, me);

router.get('/users', getAllUsers);
router.get('/users/:id', getOneUser);

router.delete('/users/:id', validateToken, deleteUser);
router.put('/users/:id', validateToken, updateUser);
router.put('/users/changerole/:id', changeUserRules, validateToken, isAdmin, changeUserRole);

export default router;
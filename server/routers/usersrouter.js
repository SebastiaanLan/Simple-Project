import Router from 'express';

import { getAllUsers, getOneUser, register, login, deleteUser, updateUser, me, logout, updateUserAdmin } from '../controllers/usercontroller.js';

import { isAdmin, isSelfOrAdmin, validateToken } from '../middleware/auth.js';

import validate from '../middleware/validate.js';
import { registerRules, loginRules, changeUserRules } from '../validators/user.js';


const router = Router();

router.post('/login', loginRules, validate, login);
router.post('/logout', logout);
router.post('/register', registerRules, validate, register);
router.get('/me', validateToken, me);

router.get('/users', validateToken, isAdmin, getAllUsers);
router.get('/users/:id', validateToken, isAdmin, getOneUser);

router.delete('/users/:id', validateToken, deleteUser);
router.put('/users/:id', validateToken, isSelfOrAdmin, changeUserRules, validate, updateUser);
router.put('/users/admin/:id', validateToken, isAdmin, changeUserRules, validate, updateUserAdmin);

export default router;
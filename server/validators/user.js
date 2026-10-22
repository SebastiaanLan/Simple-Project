import { body, param } from "express-validator";

import normalizePhone from "../util/phone.js";

export const registerRules = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required').bail()
        .isLength({ min: 2, max: 32 })
        .withMessage('Name must be between 2 and 32 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('E-mail is required').bail()
        .isEmail()
        .withMessage('Enter a valid email')
        .normalizeEmail(),
    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required').bail()
        .custom((value) => {
            if (!normalizePhone(value)) throw new Error('Please enter valid phone number');
            return true;
        })
        .customSanitizer((value) => normalizePhone(value)),
    body('password')
        .notEmpty()
        .withMessage('Password is required').bail()
        .isLength({ min:8, max: 32 })
        .withMessage('Password must be between 8 and 32 characters')
]

export const loginRules = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('E-mail is required').bail()
        .isEmail()
        .withMessage('Enter a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
]

export const changeUserRules = [
    param('id')
        .isInt({ min: 1 }),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 32 })
        .withMessage('Name must be between 2 and 32 characters'),
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Enter a valid email')
        .normalizeEmail(),
    body('phone')
        .optional()
        .trim()
        .custom((value) => {
            if (!normalizePhone(value)) throw new Error('Please enter valid phone number');
            return true;
        })
        .customSanitizer((value) => normalizePhone(value)),
    body('role')
    .optional()
    .isIn(['user', 'admin']),
]
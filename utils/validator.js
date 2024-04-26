import { body, validationResult } from 'express-validator';

// Validator middleware
const validateUser = [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('phone').isMobilePhone().withMessage('Invalid phone number format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    // Custom sanitizer to trim whitespace from input fields
    body('*').trim(),
    // Check for validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().map(error => ({ type: error.type, msg: error.msg }));
            return res.status(400).json({ errors: formattedErrors });
        }
        next();
    }
];

export default validateUser;

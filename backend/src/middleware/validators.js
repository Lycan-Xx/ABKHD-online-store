import { body } from 'express-validator';

export const validateLogin = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

export const validateProduct = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price required')
];

export const validateSettings = [
  body('whatsappNumber').trim().notEmpty().withMessage('WhatsApp number required'),
  body('contactEmail').isEmail().withMessage('Valid email required')
];
const { body } = require('express-validator');

const registerValidation = [
  body('name')
    .trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email')
    .isEmail().withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('role')
    .optional()
    .isIn(['ADMIN', 'COMMON']).withMessage('Role deve ser ADMIN ou COMMON')
];

const loginValidation = [
  body('email')
    .isEmail().withMessage('Email inválido'),
  body('password')
    .notEmpty().withMessage('Senha é obrigatória')
];

const updateValidation = [
  body('name')
    .optional()
    .isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email')
    .optional()
    .isEmail().withMessage('Email inválido'),
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('role')
    .optional()
    .isIn(['ADMIN', 'COMMON']).withMessage('Role inválida')
];

module.exports = { registerValidation, loginValidation, updateValidation };

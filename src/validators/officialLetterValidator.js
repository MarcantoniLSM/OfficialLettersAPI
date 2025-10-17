const { body } = require('express-validator');

const createLetterValidation = [
  body('destinationId')
    .isUUID().withMessage('destinationId deve ser um UUID válido'),
  body('subject')
    .trim().isLength({ min: 3 }).withMessage('Assunto deve ter pelo menos 3 caracteres'),
  body('body')
    .trim().isLength({ min: 5 }).withMessage('Texto deve ter pelo menos 5 caracteres')
];

module.exports = { createLetterValidation };

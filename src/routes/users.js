const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');
const { allowRoles } = require('../middlewares/role');
const { validate } = require('../middlewares/validate');
const { registerValidation, loginValidation, updateValidation } = require('../validators/userValidator');

// públicas
router.post('/register', registerValidation, validate, userCtrl.register);
router.post('/login', loginValidation, validate, userCtrl.login);

// protegidas
router.get('/', authenticate, allowRoles('ADMIN'), userCtrl.listUsers);
router.get('/:id', authenticate, userCtrl.getUser);
router.put('/:id', authenticate, updateValidation, validate, userCtrl.updateUser);
router.delete('/:id', authenticate, allowRoles('ADMIN'), userCtrl.deleteUser);

module.exports = router;

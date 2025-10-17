// src/routes/users.js
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');
const { allowRoles } = require('../middlewares/role');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);

router.get('/', authenticate, allowRoles('ADMIN'), userCtrl.listUsers);
router.get('/:id', authenticate, userCtrl.getUser);
router.put('/:id', authenticate, userCtrl.updateUser);
router.delete('/:id', authenticate, allowRoles('ADMIN'), userCtrl.deleteUser);

module.exports = router;

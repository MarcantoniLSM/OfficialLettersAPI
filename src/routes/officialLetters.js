const express = require('express');
const router = express.Router();
const letterCtrl = require('../controllers/officialLetterController');
const { authenticate } = require('../middlewares/auth');
const { allowRoles } = require('../middlewares/role');

// Criar uma carta
router.post('/', authenticate, letterCtrl.createLetter);

// Listagens
router.get('/sent', authenticate, letterCtrl.listSent);         // enviadas
router.get('/received', authenticate, letterCtrl.listReceived); // recebidas
router.get('/all', authenticate, allowRoles('ADMIN'), letterCtrl.listAll); // todas (admin)

module.exports = router;

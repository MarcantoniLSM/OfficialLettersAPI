const express = require('express');
const router = express.Router();
const letterCtrl = require('../controllers/officialLetterController');
const { authenticate } = require('../middlewares/auth');
const { allowRoles } = require('../middlewares/role');
const { validate } = require('../middlewares/validate');
const { createLetterValidation } = require('../validators/officialLetterValidator');

router.post('/', authenticate, createLetterValidation, validate, letterCtrl.createLetter);
router.get('/sent', authenticate, letterCtrl.listSent);
router.get('/received', authenticate, letterCtrl.listReceived);
router.get('/all', authenticate, allowRoles('ADMIN'), letterCtrl.listAll);

module.exports = router;

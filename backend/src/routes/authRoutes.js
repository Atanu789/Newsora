const express = require('express');
const { register, login, session } = require('../controllers/authController');
const { authRequired } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/session', authRequired, session);

module.exports = router;

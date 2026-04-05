const express = require('express');
const { authRequired } = require('../middleware/authMiddleware');
const { getProfile } = require('../controllers/userController');

const router = express.Router();

router.get('/profile', authRequired, getProfile);

module.exports = router;

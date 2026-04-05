const express = require('express');
const { authRequired } = require('../middleware/authMiddleware');
const { createActivity } = require('../controllers/activityController');

const router = express.Router();

router.post('/', authRequired, createActivity);

module.exports = router;

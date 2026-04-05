const express = require('express');
const { getNews, getNewsById } = require('../controllers/newsController');

const router = express.Router();

router.get('/', getNews);
router.get('/:id', getNewsById);

module.exports = router;

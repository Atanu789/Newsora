const express = require('express');
const { authRequired } = require('../middleware/authMiddleware');
const { getNews, getNewsById, getRecommendedNews } = require('../controllers/newsController');

const router = express.Router();

router.get('/', getNews);
router.get('/recommended', authRequired, getRecommendedNews);
router.get('/:id', getNewsById);

module.exports = router;

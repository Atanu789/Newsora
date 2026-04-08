const Joi = require('joi');

const asyncHandler = require('../middleware/asyncHandler');
const newsModel = require('../models/newsModel');
const { parsePagination } = require('../utils/pagination');
const { ALLOWED_CATEGORIES, SUPPORTED_LANGUAGE_CODES, normalizeLanguageCode, translateText } = require('../services/aiService');

const querySchema = Joi.object({
  category: Joi.string().valid(...ALLOWED_CATEGORIES).optional(),
  lang: Joi.string().valid(...SUPPORTED_LANGUAGE_CODES).optional(),
  page: Joi.number().integer().min(1).optional(),
  pageSize: Joi.number().integer().min(1).max(50).optional()
});

const LANGUAGE_REGION_PRIORITY = {
  bn: {
    region: 'West Bengal',
    keywords: ['west bengal', 'kolkata', 'bengal', 'howrah', 'siliguri', 'পশ্চিমবঙ্গ', 'কলকাতা']
  },
  ta: {
    region: 'Tamil Nadu',
    keywords: ['tamil nadu', 'chennai', 'coimbatore', 'தமிழ்நாடு', 'சென்னை']
  },
  te: {
    region: 'Telangana and Andhra',
    keywords: ['hyderabad', 'telangana', 'andhra pradesh', 'విశాఖపట్నం', 'హైదరాబాద్']
  },
  mr: {
    region: 'Maharashtra',
    keywords: ['maharashtra', 'mumbai', 'pune', 'नवी मुंबई', 'मुंबई']
  }
};

function getPriorityKeywords(lang) {
  return LANGUAGE_REGION_PRIORITY[lang]?.keywords || [];
}

const idSchema = Joi.object({
  id: Joi.number().integer().required()
});

const getNews = asyncHandler(async (req, res) => {
  const { error, value } = querySchema.validate(req.query);
  if (error) {
    const err = new Error(error.message);
    err.statusCode = 400;
    throw err;
  }

  const { page, pageSize, offset } = parsePagination(value);
  const data = await newsModel.findPaginated({
    category: value.category,
    pageSize,
    offset,
    priorityKeywords: getPriorityKeywords(normalizeLanguageCode(value.lang))
  });

  const lang = normalizeLanguageCode(value.lang);
  const localizedItems =
    lang === 'en'
      ? data.items
      : await Promise.all(
          data.items.map(async (item) => ({
            ...item,
            title: await translateText(item.title, lang),
            summary: await translateText(item.summary, lang)
          }))
        );

  res.json({
    page,
    pageSize,
    total: data.total,
    items: localizedItems
  });
});

const getNewsById = asyncHandler(async (req, res) => {
  const { error, value } = idSchema.validate(req.params);
  if (error) {
    const err = new Error(error.message);
    err.statusCode = 400;
    throw err;
  }

  const lang = normalizeLanguageCode(req.query.lang);

  const item = await newsModel.findById(value.id);
  if (!item) {
    const err = new Error('News not found');
    err.statusCode = 404;
    throw err;
  }

  if (lang !== 'en') {
    item.title = await translateText(item.title, lang);
    item.summary = await translateText(item.summary, lang);
  }

  res.json(item);
});

const getRecommendedNews = asyncHandler(async (req, res) => {
  const { error, value } = querySchema.validate(req.query);
  if (error) {
    const err = new Error(error.message);
    err.statusCode = 400;
    throw err;
  }

  const { page, pageSize, offset } = parsePagination(value);
  const data = await newsModel.findRecommendedByUser({
    userId: req.user.id,
    pageSize,
    offset,
    priorityKeywords: getPriorityKeywords(normalizeLanguageCode(value.lang))
  });

  const lang = normalizeLanguageCode(value.lang);
  const localizedItems =
    lang === 'en'
      ? data.items
      : await Promise.all(
          data.items.map(async (item) => ({
            ...item,
            title: await translateText(item.title, lang),
            summary: await translateText(item.summary, lang)
          }))
        );

  res.json({
    page,
    pageSize,
    total: data.total,
    items: localizedItems
  });
});

module.exports = {
  getNews,
  getNewsById,
  getRecommendedNews
};

const Joi = require('joi');

const asyncHandler = require('../middleware/asyncHandler');
const newsModel = require('../models/newsModel');
const { parsePagination } = require('../utils/pagination');
const { ALLOWED_CATEGORIES } = require('../services/aiService');

const querySchema = Joi.object({
  category: Joi.string().valid(...ALLOWED_CATEGORIES).optional(),
  page: Joi.number().integer().min(1).optional(),
  pageSize: Joi.number().integer().min(1).max(50).optional()
});

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
    offset
  });

  res.json({
    page,
    pageSize,
    total: data.total,
    items: data.items
  });
});

const getNewsById = asyncHandler(async (req, res) => {
  const { error, value } = idSchema.validate(req.params);
  if (error) {
    const err = new Error(error.message);
    err.statusCode = 400;
    throw err;
  }

  const item = await newsModel.findById(value.id);
  if (!item) {
    const err = new Error('News not found');
    err.statusCode = 404;
    throw err;
  }

  res.json(item);
});

module.exports = {
  getNews,
  getNewsById
};

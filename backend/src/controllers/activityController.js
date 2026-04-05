const Joi = require('joi');
const asyncHandler = require('../middleware/asyncHandler');
const activityModel = require('../models/activityModel');

const schema = Joi.object({
  newsId: Joi.number().integer().required(),
  action: Joi.string().valid('click', 'view', 'save', 'share').required(),
  readTime: Joi.number().integer().min(0).default(0)
});

const createActivity = asyncHandler(async (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    const err = new Error(error.message);
    err.statusCode = 400;
    throw err;
  }

  const activity = await activityModel.trackActivity({
    userId: req.user.id,
    newsId: value.newsId,
    action: value.action,
    readTime: value.readTime
  });

  res.status(201).json(activity);
});

module.exports = {
  createActivity
};

const Joi = require('joi');
const asyncHandler = require('../middleware/asyncHandler');
const submissionModel = require('../models/submissionModel');
const { moderateSubmission } = require('../services/moderationService');

const createSchema = Joi.object({
  content: Joi.string().min(40).required(),
  mediaUrl: Joi.string().uri().allow(null, ''),
  category: Joi.string().allow(null, '')
});

const idSchema = Joi.object({
  id: Joi.number().integer().required()
});

const submitNews = asyncHandler(async (req, res) => {
  const { error, value } = createSchema.validate(req.body);
  if (error) {
    const err = new Error(error.message);
    err.statusCode = 400;
    throw err;
  }

  const moderation = await moderateSubmission(value.content);

  const submission = await submissionModel.createSubmission({
    userId: req.user.id,
    content: value.content,
    mediaUrl: value.mediaUrl || null,
    category: value.category || moderation.category,
    moderationNotes: moderation.moderationNotes,
    status: moderation.status
  });

  res.status(201).json(submission);
});

const listPendingSubmissions = asyncHandler(async (req, res) => {
  const items = await submissionModel.findAllPending();
  res.json(items);
});

const approveSubmission = asyncHandler(async (req, res) => {
  const { error, value } = idSchema.validate(req.params);
  if (error) {
    const err = new Error(error.message);
    err.statusCode = 400;
    throw err;
  }

  const updated = await submissionModel.updateStatus({ id: value.id, status: 'approved' });
  if (!updated) {
    const err = new Error('Submission not found');
    err.statusCode = 404;
    throw err;
  }

  res.json(updated);
});

const rejectSubmission = asyncHandler(async (req, res) => {
  const { error, value } = idSchema.validate(req.params);
  if (error) {
    const err = new Error(error.message);
    err.statusCode = 400;
    throw err;
  }

  const updated = await submissionModel.updateStatus({ id: value.id, status: 'rejected' });
  if (!updated) {
    const err = new Error('Submission not found');
    err.statusCode = 404;
    throw err;
  }

  res.json(updated);
});

module.exports = {
  submitNews,
  listPendingSubmissions,
  approveSubmission,
  rejectSubmission
};

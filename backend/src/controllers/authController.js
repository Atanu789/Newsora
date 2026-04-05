const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');
const env = require('../config/env');
const asyncHandler = require('../middleware/asyncHandler');

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

function signToken(user) {
  const role = env.adminEmails.includes(String(user.email).toLowerCase()) ? 'admin' : 'user';
  return jwt.sign({ id: user.id, email: user.email, role }, env.jwtSecret, {
    expiresIn: '7d'
  });
}

const register = asyncHandler(async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    const err = new Error(error.message);
    err.statusCode = 400;
    throw err;
  }

  const existing = await userModel.findUserByEmail(value.email);
  if (existing) {
    const err = new Error('Email already in use');
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(value.password, 10);
  const user = await userModel.createUser({ ...value, password: hashedPassword });

  res.status(201).json({
    user,
    token: signToken(user)
  });
});

const login = asyncHandler(async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    const err = new Error(error.message);
    err.statusCode = 400;
    throw err;
  }

  const user = await userModel.findUserByEmail(value.email);
  if (!user) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const isValid = await bcrypt.compare(value.password, user.password);
  if (!isValid) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      preferences: user.preferences
    },
    token: signToken(user)
  });
});

const session = asyncHandler(async (req, res) => {
  res.json({
    user: req.user
  });
});

module.exports = {
  register,
  login,
  session
};

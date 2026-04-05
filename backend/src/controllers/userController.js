const asyncHandler = require('../middleware/asyncHandler');
const userModel = require('../models/userModel');

const getProfile = asyncHandler(async (req, res) => {
  const user = await userModel.findUserById(req.user.id);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  res.json(user);
});

module.exports = {
  getProfile
};

const User = require('../models/userModal');
const catchAsync = require('../utils/catchAsync');

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newUser,
    },
  });
});

module.exports = {
  signup,
};

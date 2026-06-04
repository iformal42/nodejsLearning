const User = require('../models/userModal');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const filteredObj = {};
  Object.keys(obj)
    .filter((key) => allowedFields.includes(key))
    .forEach((key) => {
      filteredObj[key] = obj[key];
    });
  return filteredObj;
};
const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
const createUser = (req, res) => {
  res.status(500).json('ok');
};
const getUser = (req, res) => {
  res.status(500).json('ok');
};
const updateMe = catchAsync(async (req, res, next) => {
  const { _id: id } = req.user;
  const { password, confirmPassword } = req.body;
  if (password || confirmPassword) {
    return next(
      new AppError(
        404,
        'This route is not use for update .Please use /update-password',
      ),
    );
  }
  // filter out not alowed fields
  const filterBody = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  const { _id: id } = req.user;
  await User.findByIdAndUpdate(id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
const updateUser = (req, res) => {
  res.status(500).json('ok');
};
const deleteUser = (req, res) => {
  res.status(500).json('ok');
};

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
};

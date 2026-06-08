const User = require('../models/userModal');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { deleteOne, updateOne, getOne, getAll } = require('./handleFactory');

const filterObj = (obj, ...allowedFields) => {
  const filteredObj = {};
  Object.keys(obj)
    .filter((key) => allowedFields.includes(key))
    .forEach((key) => {
      filteredObj[key] = obj[key];
    });
  return filteredObj;
};
const getAllUsers = getAll(User);
const updateUser = updateOne(User);
const deleteUser = deleteOne(User);
const getUser = getOne(User);
const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
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

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
};

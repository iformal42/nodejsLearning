const express = require('express');

const router = express.Router();

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require('../controller/userController');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = require('../controller/authController');

router.post('/signup', signup);
router.post('/login', login);
router.patch('/update-password', protect, updatePassword);

router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:resetToken', resetPassword);
router.patch('/update-me', protect, updateMe);
router.delete('/delete-me', protect, deleteMe);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
module.exports = router;

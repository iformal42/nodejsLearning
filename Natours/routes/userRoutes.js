const express = require('express');

const router = express.Router();

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} = require('../controller/userController');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictsTo,
  logout,
} = require('../controller/authController');
const { roles } = require('../utils/constanst');

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:resetToken', resetPassword);

router.use(protect);
// all below routes are protected
router.patch('/update-password', updatePassword);
router.get('/get-me', getMe, getUser);
router.patch('/update-me', uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/delete-me', protect, deleteMe);

router.use(restrictsTo(roles.admin));
// below routes accessable to admin only
router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
module.exports = router;

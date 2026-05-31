const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controller/userController');
const { signup } = require('../controller/authController');

router.post('/signup', signup);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
module.exports = router;

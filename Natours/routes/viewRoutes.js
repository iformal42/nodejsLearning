const express = require('express');
const {
  getOverview,
  getTourview,
  getLogin,
  getAccount,
  updateUserData,
} = require('../controller/viewsController');
const { isLoggedIn, protect } = require('../controller/authController');

const router = express.Router();
router.use(isLoggedIn);

router.get('/', isLoggedIn, getOverview);
router.get('/login', isLoggedIn, getLogin);
router.get('/tour/:slug', isLoggedIn, getTourview);
router.get('/me', protect, getAccount);
router.post('/submit-user-data', protect, updateUserData);

module.exports = router;

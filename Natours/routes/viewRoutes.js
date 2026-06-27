const express = require('express');
const {
  getOverview,
  getTourview,
  getLogin,
} = require('../controller/viewsController');
const { isLoggedIn } = require('../controller/authController');

const router = express.Router();
router.use(isLoggedIn);

router.get('/', getOverview);
router.get('/login', getLogin);
router.get('/tour/:slug', getTourview);

module.exports = router;

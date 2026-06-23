const express = require('express');
const { getOverview, getTourview } = require('../controller/viewsController');

const router = express.Router();

router.get('/', getOverview);
router.get('/tour/:slug', getTourview);

module.exports = router;

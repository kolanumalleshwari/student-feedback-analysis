const express = require('express');
const router = express.Router();
const {
  getSummaryAnalytics,
  getDepartmentAnalytics,
  getSubjectAnalytics,
  getSentimentAnalytics
} = require('../controllers/analyticsController');

// Routes
router.get('/summary', getSummaryAnalytics);
router.get('/departments', getDepartmentAnalytics);
router.get('/subjects', getSubjectAnalytics);
router.get('/sentiment', getSentimentAnalytics);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAllFeedback,
  getFeedbackById,
  createFeedback
} = require('../controllers/feedbackController');

// Routes
router.get('/', getAllFeedback);
router.get('/:id', getFeedbackById);
router.post('/', createFeedback);

module.exports = router;

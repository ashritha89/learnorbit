const express = require('express');
const router = express.Router();
const controller = require('./marketing.controller.js');

// Waitlist Route (Public)
router.post('/waitlist', controller.addToWaitlist);

// Contact Route (Public)
router.post('/contact', controller.submitContact);

// Feedback Route (Public/Authenticated)
router.post('/feedback', controller.submitFeedback);

module.exports = router;

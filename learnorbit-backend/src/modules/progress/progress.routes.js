// src/modules/progress/progress.routes.js
const express = require('express');
const router = express.Router();

const controller = require('./progress.controller');
const { protect, isStudent } = require('../../middlewares/rbac.middleware');

// Mark progress for a lesson
router.post('/api/v1/lessons/:lessonId/progress', protect, isStudent, controller.markProgress);

// Get aggregated progress for a course
router.get('/api/v1/courses/:courseId/progress', protect, isStudent, controller.getCourseProgress);

module.exports = router;

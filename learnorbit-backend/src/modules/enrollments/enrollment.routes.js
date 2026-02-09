// src/modules/enrollments/enrollment.routes.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams allows :id from parent router

const controller = require('./enrollment.controller');
const { protect, isStudent } = require('../../middlewares/rbac.middleware');

// Enroll endpoint – POST /courses/:id/enroll
router.post('/enroll', protect, isStudent, controller.enroll);

// Student's own enrollments – GET /me/enrollments (mounted under /api/me)
router.get('/me/enrollments', protect, isStudent, controller.getMyEnrollments);

module.exports = router;

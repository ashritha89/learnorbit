// src/modules/dashboard/dashboard.routes.js
const express = require('express');
const router = express.Router();

const controller = require('./dashboard.controller');
const { protect, isStudent, isInstructorOrAdmin, isAdmin } = require('../../middlewares/rbac.middleware');

// Student dashboard (student role)
router.get('/student', protect, isStudent, controller.studentDashboard);

// Instructor dashboard (instructor role)
router.get('/instructor', protect, isInstructorOrAdmin, controller.instructorDashboard);

// Admin dashboard (admin role)
router.get('/admin', protect, isAdmin, controller.adminDashboard);

module.exports = router;

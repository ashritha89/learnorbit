// src/modules/courses/course.routes.js
const express = require('express');
const router = express.Router();

const controller = require('./course.controller');
const { protect, isInstructorOrAdmin, isStudent, isAdmin, hasPermission } = require('../../middlewares/rbac.middleware');

// PUBLIC – accessible to everyone (no auth needed)
router.get('/', controller.getAllPublished);
router.get('/:id', controller.getById);

// INSTRUCTOR – protect + role check
router.post('/', protect, isInstructorOrAdmin, controller.create);
router.put('/:id', protect, isInstructorOrAdmin, controller.update);
router.patch('/:id/publish', protect, isInstructorOrAdmin, controller.publish);
router.delete('/:id', protect, isInstructorOrAdmin, controller.delete);

module.exports = router;

// src/routes/course.routes.js
const express = require('express');
const router = express.Router();

const courseController = require('../controllers/course.controller');
const { protect, authorizeRoles } = require('../middlewares/auth.middleware');
const auditMiddleware = require('../middlewares/audit.middleware');

/** PUBLIC ENDPOINTS */
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

/** ADMIN ONLY ENDPOINTS */
router.post('/', protect, authorizeRoles('admin', 'superadmin'), auditMiddleware, courseController.createCourse);
router.put('/:id', protect, authorizeRoles('admin', 'superadmin'), auditMiddleware, courseController.updateCourse);
router.delete('/:id', protect, authorizeRoles('admin', 'superadmin'), auditMiddleware, courseController.deleteCourse);

module.exports = router;

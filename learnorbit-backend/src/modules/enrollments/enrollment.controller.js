// src/modules/enrollments/enrollment.controller.js
const enrollmentService = require('./enrollment.service');

function sendResponse(res, statusCode, data, message = null) {
  const payload = { success: true, data };
  if (message) payload.message = message;
  res.status(statusCode).json(payload);
}

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// POST /courses/:id/enroll – student enrolls in a course
exports.enroll = asyncHandler(async (req, res) => {
  const studentId = req.user.id; // set by protect middleware
  const courseId = parseInt(req.params.id, 10);
  const result = await enrollmentService.enroll(studentId, courseId);
  sendResponse(res, 201, result, 'Enrolled successfully');
});

// GET /api/v1/admin/enrollments?status=pending – list pending enrollments (admin/instructor)
exports.listPending = asyncHandler(async (req, res) => {
  const enrollments = await enrollmentService.listPending(req.user);
  sendResponse(res, 200, enrollments, 'Pending enrollments retrieved');
});

// PATCH /api/v1/admin/enrollments/:id/approve – approve enrollment
exports.approve = asyncHandler(async (req, res) => {
  const enrollmentId = parseInt(req.params.id, 10);
  const result = await enrollmentService.approve(enrollmentId, req.user);
  sendResponse(res, 200, result, 'Enrollment approved');
});

// PATCH /api/v1/admin/enrollments/:id/reject – reject enrollment
exports.reject = asyncHandler(async (req, res) => {
  const enrollmentId = parseInt(req.params.id, 10);
  const result = await enrollmentService.reject(enrollmentId, req.user);
  sendResponse(res, 200, result, 'Enrollment rejected');
});

exports.getMyEnrollments = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const enrollments = await enrollmentService.listByStudent(studentId);
  sendResponse(res, 200, enrollments, 'Enrollments retrieved');
});

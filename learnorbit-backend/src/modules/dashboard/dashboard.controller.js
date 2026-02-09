// src/modules/dashboard/dashboard.controller.js
const dashboardService = require('./dashboard.service');
const logger = require('../../utils/logger');

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

// GET /api/v1/dashboard/student
exports.studentDashboard = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const data = await dashboardService.getStudentDashboard(studentId);
  sendResponse(res, 200, data);
});

// GET /api/v1/dashboard/instructor
exports.instructorDashboard = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;
  const data = await dashboardService.getInstructorDashboard(instructorId);
  sendResponse(res, 200, data);
});

// GET /api/v1/dashboard/admin
exports.adminDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getAdminDashboard();
  sendResponse(res, 200, data);
});

module.exports = exports;

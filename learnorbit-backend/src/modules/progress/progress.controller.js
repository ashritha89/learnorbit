// src/modules/progress/progress.controller.js
const progressService = require('./progress.service');
const logger = require('../../utils/logger');

// Standard response helper
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

// POST /api/v1/lessons/:lessonId/progress
exports.markProgress = asyncHandler(async (req, res) => {
  const studentId = req.user.id; // set by protect middleware
  const lessonId = parseInt(req.params.lessonId, 10);
  const { watch_percentage, completed } = req.body;
  const result = await progressService.markProgress(studentId, lessonId, { watch_percentage, completed });
  sendResponse(res, 200, result, 'Progress recorded');
});

// GET /api/v1/courses/:courseId/progress
exports.getCourseProgress = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const courseId = parseInt(req.params.courseId, 10);
  const data = await progressService.getCourseProgress(studentId, courseId);
  sendResponse(res, 200, data);
});

module.exports = exports;

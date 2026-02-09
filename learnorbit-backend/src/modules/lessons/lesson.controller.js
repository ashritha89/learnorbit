// src/modules/lessons/lesson.controller.js
const lessonService = require('./lesson.service');
const logger = require('../../utils/logger');

// Helper to format standard responses
function sendResponse(res, statusCode, data, message = null) {
  const payload = { success: true, data };
  if (message) payload.message = message;
  res.status(statusCode).json(payload);
}

// Async wrapper
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// INSTRUCTOR ENDPOINTS
exports.create = asyncHandler(async (req, res) => {
  const instructorId = req.user.id; // set by protect middleware
  const courseId = req.params.courseId;
  const result = await lessonService.create(instructorId, courseId, req.body);
  sendResponse(res, 201, { id: result.id }, 'Lesson created');
});

exports.update = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;
  const lessonId = req.params.id;
  const result = await lessonService.update(instructorId, lessonId, req.body);
  sendResponse(res, 200, result, 'Lesson updated');
});

exports.delete = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;
  const lessonId = req.params.id;
  const result = await lessonService.delete(instructorId, lessonId);
  sendResponse(res, 200, result, 'Lesson deleted');
});

exports.listForInstructor = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;
  const courseId = req.params.courseId;
  const lessons = await lessonService.listForInstructor(instructorId, courseId);
  sendResponse(res, 200, lessons);
});

// STUDENT ENDPOINT
exports.listForStudent = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const courseId = req.params.courseId;
  const lessons = await lessonService.listForStudent(studentId, courseId);
  sendResponse(res, 200, lessons);
});

module.exports = exports;

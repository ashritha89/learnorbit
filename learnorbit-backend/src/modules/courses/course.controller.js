// src/modules/courses/course.controller.js
const courseService = require('./course.service');
const logger = require('../../utils/logger');

// Helper to format standard responses
function sendResponse(res, statusCode, data, message = null) {
  const payload = { success: true, data };
  if (message) payload.message = message;
  res.status(statusCode).json(payload);
}

// Error handling wrapper
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// PUBLIC ENDPOINTS
exports.getAllPublished = asyncHandler(async (req, res) => {
  const courses = await courseService.getAllPublished();
  sendResponse(res, 200, courses);
});

exports.getById = asyncHandler(async (req, res) => {
  const course = await courseService.getById(parseInt(req.params.id, 10));
  sendResponse(res, 200, course);
});

// INSTRUCTOR ENDPOINTS
exports.create = asyncHandler(async (req, res) => {
  const instructorId = req.user.id; // set by protect middleware
  const result = await courseService.create(instructorId, req.body);
  sendResponse(res, 201, { id: result.id }, 'Course created');
});

exports.update = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;
  const courseId = parseInt(req.params.id, 10);
  const result = await courseService.update(instructorId, courseId, req.body);
  sendResponse(res, 200, result, 'Course updated');
});

exports.publish = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;
  const courseId = parseInt(req.params.id, 10);
  const result = await courseService.publish(instructorId, courseId);
  sendResponse(res, 200, result, 'Course published');
});

exports.delete = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;
  const courseId = parseInt(req.params.id, 10);
  const result = await courseService.delete(instructorId, courseId);
  sendResponse(res, 200, result, 'Course deleted');
});

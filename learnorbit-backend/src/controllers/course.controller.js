// src/controllers/course.controller.js
const pool = require('../config/database');
// const redis = require('../config/redisClient');
const logger = require('../utils/logger');

// Cache configuration
const CACHE_TTL = 300; // 5 minutes
const CACHE_KEY_ALL_COURSES = 'courses:all';

/** Helper to validate course payload */
function validateCoursePayload(payload) {
  const { title, description, start_date, end_date } = payload;
  if (!title || typeof title !== 'string') return 'Title is required and must be a string';
  if (description && typeof description !== 'string') return 'Description must be a string';
  if (start_date && isNaN(Date.parse(start_date))) return 'start_date must be a valid date';
  if (end_date && isNaN(Date.parse(end_date))) return 'end_date must be a valid date';
  return null; // no errors
}

/** Helper to invalidate course cache */
async function invalidateCourseCache() {
  // Redis removed
}

/** ---------- PUBLIC ENDPOINTS ---------- */

/**
 * GET /api/courses
 * Fetch all active courses with Redis caching (5 min TTL)
 */
exports.getAllCourses = async (req, res, next) => {
  try {
    // Try cache first
    // Redis removed

    // Fetch from database
    const { rows } = await pool.query(
      'SELECT id, title, description, start_date, end_date, is_active FROM courses WHERE is_active = TRUE'
    );

    // Store in cache for 5 minutes
    // Redis removed

    res.json({ success: true, data: rows, cached: false });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/courses/:id
 * Fetch a single course by ID
 */
exports.getCourseById = async (req, res, next) => {
  const courseId = req.params.id;
  try {
    const { rows } = await pool.query(
      'SELECT id, title, description, start_date, end_date, is_active FROM courses WHERE id = $1 AND is_active = TRUE',
      [courseId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

/** ---------- ADMIN ENDPOINTS ---------- */

/**
 * POST /api/courses
 * Create a new course (Admin only)
 */
exports.createCourse = async (req, res, next) => {
  const validationError = validateCoursePayload(req.body);
  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }
  const { title, description, start_date, end_date } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO courses (title, description, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING id',
      [title, description || null, start_date || null, end_date || null]
    );

    // Invalidate cache
    await invalidateCourseCache();

    res.status(201).json({ success: true, message: 'Course created', courseId: rows[0].id });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/courses/:id
 * Update an existing course (Admin only)
 */
exports.updateCourse = async (req, res, next) => {
  const courseId = req.params.id;
  const validationError = validateCoursePayload(req.body);
  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }
  const { title, description, start_date, end_date, is_active } = req.body;
  try {
    const result = await pool.query(
      `UPDATE courses SET title = $1, description = $2, start_date = $3, end_date = $4, is_active = $5 WHERE id = $6`,
      [title, description || null, start_date || null, end_date || null, is_active !== undefined ? !!is_active : true, courseId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Invalidate cache
    await invalidateCourseCache();

    res.json({ success: true, message: 'Course updated' });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/courses/:id
 * Soft delete a course (Admin only)
 */
exports.deleteCourse = async (req, res, next) => {
  const courseId = req.params.id;
  try {
    const result = await pool.query('UPDATE courses SET is_active = FALSE WHERE id = $1', [courseId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Invalidate cache
    await invalidateCourseCache();

    res.json({ success: true, message: 'Course deactivated' });
  } catch (err) {
    next(err);
  }
};


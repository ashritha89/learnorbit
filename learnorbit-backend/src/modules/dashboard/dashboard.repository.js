// src/modules/dashboard/dashboard.repository.js
const pool = require('../../config/db');
const logger = require('../../utils/logger');

class DashboardRepository {
  // Student dashboard: approved enrollments with progress per course
  async getStudentDashboard(studentId) {
    const sql = `
      SELECT c.id AS course_id, c.title, c.thumbnail_url,
        COUNT(l.id) AS total_lessons,
        SUM(CASE WHEN lp.completed = 1 THEN 1 ELSE 0 END) AS completed_lessons,
        MAX(lp.updated_at) AS last_accessed_at,
        MAX(l.id) FILTER (WHERE lp.updated_at = MAX(lp.updated_at)) AS resume_lesson_id
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN lessons l ON l.course_id = c.id AND l.is_deleted = FALSE
      LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = ?
      WHERE e.student_id = ? AND e.status = 'approved'
      GROUP BY c.id, c.title, c.thumbnail_url
    `;
    // MySQL does not support FILTER, so we will compute resume later in service.
    // Here we just get last_accessed_at per course.
    const [rows] = await pool.execute(sql, [studentId, studentId]);
    return rows;
  }

  // Instructor dashboard: courses owned by instructor with enrollment stats
  async getInstructorDashboard(instructorId) {
    const sql = `
      SELECT c.id AS course_id, c.title, c.thumbnail_url, c.is_published,
        COUNT(e.id) AS total_enrollments,
        SUM(CASE WHEN e.status = 'approved' THEN 1 ELSE 0 END) AS approved_enrollments,
        SUM(CASE WHEN e.status = 'pending' THEN 1 ELSE 0 END) AS pending_enrollments
      FROM courses c
      LEFT JOIN enrollments e ON e.course_id = c.id
      WHERE c.instructor_id = ?
      GROUP BY c.id, c.title, c.thumbnail_url, c.is_published
    `;
    const [rows] = await pool.execute(sql, [instructorId]);
    return rows;
  }

  // Admin dashboard: platform-wide aggregates
  async getAdminDashboard() {
    const sql = `
      SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'student') AS total_students,
        (SELECT COUNT(*) FROM users WHERE role = 'instructor') AS total_instructors,
        (SELECT COUNT(*) FROM courses) AS total_courses,
        (SELECT COUNT(*) FROM enrollments) AS total_enrollments,
        (SELECT COUNT(*) FROM enrollments WHERE status = 'pending') AS pending_enrollments
    `;
    const [rows] = await pool.execute(sql);
    return rows[0] || {};
  }

  // Get last accessed lesson per course for a student (resume lesson)
  async getResumeLesson(studentId, courseId) {
    const sql = `
      SELECT lp.lesson_id, lp.updated_at
      FROM lesson_progress lp
      JOIN lessons l ON lp.lesson_id = l.id
      WHERE lp.student_id = ? AND l.course_id = ?
      ORDER BY lp.updated_at DESC
      LIMIT 1`;
    const [rows] = await pool.execute(sql, [studentId, courseId]);
    return rows[0] || null;
  }
}

module.exports = new DashboardRepository();

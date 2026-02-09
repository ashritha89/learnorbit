// src/modules/enrollments/enrollment.repository.js
const pool = require('../../config/db');
const logger = require('../../utils/logger');

class EnrollmentRepository {
  // Create a new enrollment (assumes validation already done)
  async create(studentId, courseId, status = 'pending') {
    const sql = `INSERT INTO enrollments (student_id, course_id, status) VALUES (?,?,?)`;
    const [result] = await pool.execute(sql, [studentId, courseId, status]);
    return result.insertId;
  }

  // Check if an enrollment exists (any status)
  async exists(studentId, courseId) {
    const sql = `SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?`;
    const [rows] = await pool.execute(sql, [studentId, courseId]);
    return rows.length > 0;
  }

  // Get enrollment status for a student in a specific course
  async getStatus(studentId, courseId) {
    const sql = `SELECT status FROM enrollments WHERE student_id = ? AND course_id = ?`;
    const [rows] = await pool.execute(sql, [studentId, courseId]);
    if (rows.length === 0) return null;
    return rows[0].status;
  }

  // Get all enrollments for a student, joining course info (excluding deleted courses)
  async findByStudent(studentId) {
    const sql = `
      SELECT e.id AS enrollment_id, c.id AS course_id, c.title, c.description, c.thumbnail_url, c.is_published
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = ? AND c.is_deleted = FALSE
    `;
    const [rows] = await pool.execute(sql, [studentId]);
    return rows;
  }
}

module.exports = new EnrollmentRepository();

// src/modules/enrollments/enrollment.repository.js
const pool = require('../../config/database');
const logger = require('../../utils/logger');

class EnrollmentRepository {
  /**
   * Create a new enrollment record
   * @param {number} userId - ID of the user (active student)
   * @param {number} courseId - ID of the course
   * @param {string} status - 'active' or 'pending'
   * @returns {Promise<number>} - Insert ID
   */
  async create(userId, courseId, status = 'active') {
    const sql = `INSERT INTO enrollments (user_id, course_id, status) VALUES ($1, $2, $3) RETURNING id`;
    const { rows } = await pool.query(sql, [userId, courseId, status]);
    return rows[0].id;
  }

  /**
   * Check if a user is already enrolled in a course
   * @param {number} userId
   * @param {number} courseId
   * @returns {Promise<boolean>}
   */
  async exists(userId, courseId) {
    const sql = `SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2`;
    const { rows } = await pool.query(sql, [userId, courseId]);
    return rows.length > 0;
  }

  /**
   * Get enrollment status ('active' or 'pending')
   * @param {number} userId
   * @param {number} courseId
   * @returns {Promise<string|null>}
   */
  async getStatus(userId, courseId) {
    const sql = `SELECT status FROM enrollments WHERE user_id = $1 AND course_id = $2`;
    const { rows } = await pool.query(sql, [userId, courseId]);
    if (rows.length === 0) return null;
    return rows[0].status;
  }

  /**
   * Get all active enrollments for a user
   * @param {number} userId
   * @returns {Promise<Array>}
   */
  async findByCourse(courseId) {
    const sql = `
      SELECT e.*, u.name as student_name, u.email as student_email 
      FROM enrollments e 
      JOIN users u ON e.user_id = u.id 
      WHERE e.course_id = $1
      ORDER BY e.created_at DESC
    `;
    const { rows } = await pool.query(sql, [courseId]);
    return rows;
  }

  async findById(id) {
    const sql = `SELECT * FROM enrollments WHERE id = $1`;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  async updateStatus(enrollmentId, status) {
    const sql = `UPDATE enrollments SET status = $1 WHERE id = $2`;
    const result = await pool.query(sql, [status, enrollmentId]);
    return result.rowCount;
  }

  async deleteEnrollment(enrollmentId) {
    const sql = `DELETE FROM enrollments WHERE id = $1`;
    const result = await pool.query(sql, [enrollmentId]);
    return result.rowCount;
  }
}

module.exports = new EnrollmentRepository();

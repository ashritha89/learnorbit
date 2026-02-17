// src/modules/courses/course.repository.js
const pool = require('../../config/database');
const logger = require('../../utils/logger');

/**
 * Course Repository – all DB interactions use prepared statements.
 */
class CourseRepository {
  async create(course) {
    const sql = `INSERT INTO courses (instructor_id, title, description, thumbnail_url, is_published) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const params = [course.instructor_id, course.title, course.description || null, course.thumbnail_url || null, course.is_published ? 1 : 0];
    const { rows } = await pool.query(sql, params);
    return rows[0].id;
  }

  async findById(id) {
    const sql = `SELECT * FROM courses WHERE id = $1 AND is_published = TRUE`;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  async findAnyById(id) {
    const sql = `SELECT * FROM courses WHERE id = $1`;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  async findAllPublished() {
    const sql = `SELECT id, title, description, thumbnail_url FROM courses WHERE is_published = TRUE`;
    const { rows } = await pool.query(sql);
    return rows;
  }

  async update(id, updates) {
    const fields = [];
    const params = [];
    if (updates.title !== undefined) { fields.push(`title = $${params.length + 1}`); params.push(updates.title); }
    if (updates.description !== undefined) { fields.push(`description = $${params.length + 1}`); params.push(updates.description); }
    if (updates.thumbnail_url !== undefined) { fields.push(`thumbnail_url = $${params.length + 1}`); params.push(updates.thumbnail_url); }
    if (updates.is_published !== undefined) { fields.push(`is_published = $${params.length + 1}`); params.push(updates.is_published ? 1 : 0); }
    if (fields.length === 0) return; // nothing to update

    params.push(id);
    const sql = `UPDATE courses SET ${fields.join(', ')} WHERE id = $${params.length}`;

    const result = await pool.query(sql, params);
    return result.rowCount;
  }

  async publish(id) {
    const sql = `UPDATE courses SET is_published = TRUE WHERE id = $1`;
    const result = await pool.query(sql, [id]);
    return result.rowCount;
  }

  async delete(id) {
    // Hard delete
    const sql = `DELETE FROM courses WHERE id = $1`;
    const result = await pool.query(sql, [id]);
    return result.rowCount;
  }

  async findByInstructor(instructorId) {
    const sql = `
      SELECT c.*, 
        (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) as enrollment_count
      FROM courses c 
      WHERE c.instructor_id = $1
      ORDER BY c.created_at DESC
    `;
    const { rows } = await pool.query(sql, [instructorId]);
    return rows;
  }
}

module.exports = new CourseRepository();

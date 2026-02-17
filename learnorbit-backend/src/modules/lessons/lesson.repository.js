// src/modules/lessons/lesson.repository.js
const pool = require('../../config/database');
const logger = require('../../utils/logger');

class LessonRepository {
  // Create a new lesson and return its id
  async create(lesson) {
    const sql = `INSERT INTO lessons (course_id, title, type, content, provider, embed_url, order_index) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
    const params = [lesson.course_id, lesson.title, lesson.type, lesson.content, lesson.provider || null, lesson.embed_url || null, lesson.order_index];
    const { rows } = await pool.query(sql, params);
    return rows[0].id;
  }

  // Update lesson fields
  async update(id, updates) {
    const fields = [];
    const params = [];
    if (updates.title !== undefined) { fields.push(`title = $${params.length + 1}`); params.push(updates.title); }
    if (updates.type !== undefined) { fields.push(`type = $${params.length + 1}`); params.push(updates.type); }
    if (updates.content !== undefined) { fields.push(`content = $${params.length + 1}`); params.push(updates.content); }
    if (updates.provider !== undefined) { fields.push(`provider = $${params.length + 1}`); params.push(updates.provider); }
    if (updates.embed_url !== undefined) { fields.push(`embed_url = $${params.length + 1}`); params.push(updates.embed_url); }
    if (updates.order_index !== undefined) { fields.push(`order_index = $${params.length + 1}`); params.push(updates.order_index); }
    if (fields.length === 0) return;

    params.push(id);
    const sql = `UPDATE lessons SET ${fields.join(', ')} WHERE id = $${params.length}`;

    const result = await pool.query(sql, params);
    return result.rowCount;
  }

  // Soft delete lesson (set is_deleted flag)
  async delete(id) {
    const sql = `UPDATE lessons SET is_deleted = TRUE WHERE id = $1`;
    const result = await pool.query(sql, [id]);
    return result.rowCount;
  }

  // Get ordered lessons for a course (excluding deleted lessons)
  async findByCourseOrdered(courseId) {
    const sql = `SELECT id, title, type, content, provider, embed_url, order_index FROM lessons WHERE course_id = $1 AND is_deleted = FALSE ORDER BY order_index ASC`;
    const { rows } = await pool.query(sql, [courseId]);
    return rows;
  }

  // Find lesson by id (used for ownership checks)
  async findById(id) {
    const sql = `SELECT * FROM lessons WHERE id = $1`;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
  }
}

module.exports = new LessonRepository();

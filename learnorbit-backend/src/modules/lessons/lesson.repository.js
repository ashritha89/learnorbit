// src/modules/lessons/lesson.repository.js
const pool = require('../../config/db');
const logger = require('../../utils/logger');

class LessonRepository {
  // Create a new lesson and return its id
  async create(lesson) {
    const sql = `INSERT INTO lessons (course_id, title, type, content, provider, embed_url, order_index) VALUES (?,?,?,?,?,?,?)`;
    const params = [lesson.course_id, lesson.title, lesson.type, lesson.content, lesson.provider || null, lesson.embed_url || null, lesson.order_index];
    const [result] = await pool.execute(sql, params);
    return result.insertId;
  }

  // Update lesson fields
  async update(id, updates) {
    const fields = [];
    const params = [];
    if (updates.title !== undefined) { fields.push('title = ?'); params.push(updates.title); }
    if (updates.type !== undefined) { fields.push('type = ?'); params.push(updates.type); }
    if (updates.content !== undefined) { fields.push('content = ?'); params.push(updates.content); }
    if (updates.provider !== undefined) { fields.push('provider = ?'); params.push(updates.provider); }
    if (updates.embed_url !== undefined) { fields.push('embed_url = ?'); params.push(updates.embed_url); }
    if (updates.order_index !== undefined) { fields.push('order_index = ?'); params.push(updates.order_index); }
    if (fields.length === 0) return;
    const sql = `UPDATE lessons SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);
    const [result] = await pool.execute(sql, params);
    return result.affectedRows;
  }

  // Soft delete lesson (set is_deleted flag)
  async delete(id) {
    const sql = `UPDATE lessons SET is_deleted = TRUE WHERE id = ?`;
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows;
  }

  // Get ordered lessons for a course (excluding deleted lessons)
  async findByCourseOrdered(courseId) {
    const sql = `SELECT id, title, type, content, provider, embed_url, order_index FROM lessons WHERE course_id = ? AND is_deleted = FALSE ORDER BY order_index ASC`;
    const [rows] = await pool.execute(sql, [courseId]);
    return rows;
  }

  // Find lesson by id (used for ownership checks)
  async findById(id) {
    const sql = `SELECT * FROM lessons WHERE id = ?`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  }
}

module.exports = new LessonRepository();

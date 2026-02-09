// src/modules/progress/progress.repository.js
const pool = require('../../config/db');
const logger = require('../../utils/logger');

class ProgressRepository {
  // Upsert progress record
  async upsert(studentId, lessonId, completed, watchPercentage) {
    const sql = `INSERT INTO lesson_progress (student_id, lesson_id, completed, watch_percentage)
                 VALUES (?,?,?,?)
                 ON DUPLICATE KEY UPDATE completed = VALUES(completed), watch_percentage = VALUES(watch_percentage), updated_at = CURRENT_TIMESTAMP`;
    const params = [studentId, lessonId, completed ? 1 : 0, watchPercentage];
    const [result] = await pool.execute(sql, params);
    return result.affectedRows;
  }

  // Get progress for a specific lesson and student
  async getByStudentLesson(studentId, lessonId) {
    const sql = `SELECT * FROM lesson_progress WHERE student_id = ? AND lesson_id = ?`;
    const [rows] = await pool.execute(sql, [studentId, lessonId]);
    return rows[0] || null;
  }

  // Get all progress records for a student within a course (joined with lessons)
  async getCourseProgress(studentId, courseId) {
    const sql = `SELECT l.id AS lesson_id, lp.completed, lp.watch_percentage, lp.updated_at
                 FROM lessons l
                 LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.student_id = ?
                 WHERE l.course_id = ?`;
    const [rows] = await pool.execute(sql, [studentId, courseId]);
    return rows;
  }
}

module.exports = new ProgressRepository();

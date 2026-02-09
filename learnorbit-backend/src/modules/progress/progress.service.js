// src/modules/progress/progress.service.js
const progressRepo = require('./progress.repository');
const lessonRepo = require('../lessons/lesson.repository');
const enrollmentRepo = require('../enrollments/enrollment.repository');
const logger = require('../../utils/logger');

class ProgressService {
  // Helper to check enrollment status
  async _ensureApprovedEnrollment(studentId, courseId) {
    const status = await enrollmentRepo.getStatus(studentId, courseId);
    if (!status) {
      throw { status: 403, message: 'Student not enrolled in this course' };
    }
    if (status !== 'approved') {
      throw { status: 403, message: 'Enrollment not approved' };
    }
    return true;
  }

  // Mark or update progress for a lesson
  async markProgress(studentId, lessonId, { watch_percentage, completed }) {
    // Validate watch_percentage
    if (typeof watch_percentage !== 'number' || watch_percentage < 0 || watch_percentage > 100) {
      throw { status: 400, message: 'watch_percentage must be a number between 0 and 100' };
    }
    if (typeof completed !== 'boolean') {
      throw { status: 400, message: 'completed must be a boolean' };
    }
    // Verify lesson exists and get its course
    const lesson = await lessonRepo.findById(lessonId);
    if (!lesson) {
      throw { status: 404, message: 'Lesson not found' };
    }
    // Verify enrollment approval for the course
    await this._ensureApprovedEnrollment(studentId, lesson.course_id);
    // Upsert progress record
    await progressRepo.upsert(studentId, lessonId, completed, watch_percentage);
    return { message: 'Progress saved' };
  }

  // Get aggregated progress for a course
  async getCourseProgress(studentId, courseId) {
    // Verify enrollment
    await this._ensureApprovedEnrollment(studentId, courseId);
    // Total lessons count
    const lessons = await lessonRepo.findByCourseOrdered(courseId);
    const totalLessons = lessons.length;
    // Fetch progress rows joined with lessons
    const rows = await progressRepo.getCourseProgress(studentId, courseId);
    let completedLessons = 0;
    let latestUpdatedAt = null;
    let resumeLessonId = null;
    rows.forEach(row => {
      if (row.completed) completedLessons++;
      if (row.updated_at) {
        const updated = new Date(row.updated_at);
        if (!latestUpdatedAt || updated > latestUpdatedAt) {
          latestUpdatedAt = updated;
          resumeLessonId = row.lesson_id;
        }
      }
    });
    const completionPercentage = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
    return {
      totalLessons,
      completedLessons,
      completionPercentage,
      resumeLessonId,
    };
  }
}

module.exports = new ProgressService();

// src/modules/dashboard/dashboard.service.js
const dashboardRepo = require('./dashboard.repository');
const progressRepo = require('../progress/progress.repository'); // reuse for getCourseProgress if needed
const lessonRepo = require('../lessons/lesson.repository');
const enrollmentRepo = require('../enrollments/enrollment.repository');
const logger = require('../../utils/logger');

class DashboardService {
  // Student dashboard
  async getStudentDashboard(studentId) {
    // Get approved enrollments with course info and lesson counts
    const courses = await dashboardRepo.getStudentDashboard(studentId);
    const result = [];
    for (const c of courses) {
      const totalLessons = parseInt(c.total_lessons, 10) || 0;
      const completedLessons = parseInt(c.completed_lessons, 10) || 0;
      const completionPercentage = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
      // Get resume lesson (latest accessed)
      const resume = await dashboardRepo.getResumeLesson(studentId, c.course_id);
      const resumeLessonId = resume ? resume.lesson_id : null;
      result.push({
        courseId: c.course_id,
        title: c.title,
        thumbnail: c.thumbnail_url,
        totalLessons,
        completedLessons,
        completionPercentage,
        resumeLessonId,
      });
    }
    return result;
  }

  // Instructor dashboard
  async getInstructorDashboard(instructorId) {
    const courses = await dashboardRepo.getInstructorDashboard(instructorId);
    return courses.map(c => ({
      courseId: c.course_id,
      title: c.title,
      thumbnail: c.thumbnail_url,
      isPublished: !!c.is_published,
      totalEnrollments: parseInt(c.total_enrollments, 10) || 0,
      approvedEnrollments: parseInt(c.approved_enrollments, 10) || 0,
      pendingEnrollments: parseInt(c.pending_enrollments, 10) || 0,
    }));
  }

  // Admin dashboard
  async getAdminDashboard() {
    const stats = await dashboardRepo.getAdminDashboard();
    return {
      totalUsers: parseInt(stats.total_users, 10) || 0,
      totalStudents: parseInt(stats.total_students, 10) || 0,
      totalInstructors: parseInt(stats.total_instructors, 10) || 0,
      totalCourses: parseInt(stats.total_courses, 10) || 0,
      totalEnrollments: parseInt(stats.total_enrollments, 10) || 0,
      pendingEnrollments: parseInt(stats.pending_enrollments, 10) || 0,
    };
  }
}

module.exports = new DashboardService();

// src/modules/enrollments/enrollment.service.js
const enrollmentRepo = require('./enrollment.repository');
const courseRepo = require('../courses/course.repository');
const userRepo = require('../../repositories/user.repository');
const { addPaidEnrollmentJob } = require('../../queues/email.queue');

class EnrollmentService {
  // Enroll a student in a course
  async enroll(studentId, courseId) {
    // 1️⃣ Verify course exists, is published and not deleted
    const course = await courseRepo.findById(courseId);
    if (!course) {
      const err = new Error('Course not found');
      err.status = 404;
      throw err;
    }
    if (!course.is_published || course.is_deleted) {
      const err = new Error('Course is not available for enrollment');
      err.status = 400;
      throw err;
    }

    // 2️⃣ Prevent duplicate enrollment
    const already = await enrollmentRepo.exists(studentId, courseId);
    if (already) {
      const err = new Error('Student already enrolled in this course');
      err.status = 400;
      throw err;
    }

    // 3️⃣ Determine status based on free/paid
    const status = course.is_free ? 'approved' : 'pending';

    // 4️⃣ Create enrollment record
    const enrollmentId = await enrollmentRepo.create(studentId, courseId, status);

    // 5️⃣ If paid (status pending), push email notification job
    if (!course.is_free) {
      try {
        const [student, instructor] = await Promise.all([
          userRepo.findById(studentId),
          userRepo.findById(course.instructor_id),
        ]);
        const emailPayload = {
          enrollment_id: enrollmentId,
          student_name: student.name,
          student_email: student.email,
          course_title: course.title,
          instructor_email: instructor.email,
          admin_email: process.env.ADMIN_EMAIL,
        };
        await addPaidEnrollmentJob(emailPayload);
      } catch (e) {
        // Log but do not fail enrollment creation
        const logger = require('../../utils/logger');
        logger.error('Failed to enqueue paid enrollment email', { error: e.stack, enrollmentId });
      }
    }

    return { enrollment_id: enrollmentId, status };
  }

  // List student's enrollments with course details (excluding deleted courses)
  async listByStudent(studentId) {
    return await enrollmentRepo.findByStudent(studentId);
  }
}

module.exports = new EnrollmentService();

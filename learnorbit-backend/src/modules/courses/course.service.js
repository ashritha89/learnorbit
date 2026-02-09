// src/modules/courses/course.service.js
const courseRepo = require('./course.repository');
const logger = require('../../utils/logger');

class CourseService {
  // Validation for payload (title required)
  validatePayload(payload) {
    if (!payload.title || typeof payload.title !== 'string') {
      return 'Title is required and must be a string';
    }
    // Additional optional fields can be validated here if needed
    return null;
  }

  async create(instructorId, payload) {
    const err = this.validatePayload(payload);
    if (err) throw { status: 400, message: err };
    const course = {
      instructor_id: instructorId,
      title: payload.title,
      description: payload.description || null,
      thumbnail_url: payload.thumbnail_url || null,
      is_published: false,
    };
    const id = await courseRepo.create(course);
    return { id };
  }

  async getAllPublished() {
    return await courseRepo.findAllPublished();
  }

  async getById(id) {
    const course = await courseRepo.findById(id);
    if (!course) throw { status: 404, message: 'Course not found' };
    return course;
  }

  async update(instructorId, courseId, payload) {
    const existing = await courseRepo.findById(courseId);
    if (!existing) throw { status: 404, message: 'Course not found' };
    // Owner check – instructor can only edit own courses unless admin (handled by RBAC middleware)
    if (existing.instructor_id !== instructorId) {
      throw { status: 403, message: 'Not authorized to edit this course' };
    }
    await courseRepo.update(courseId, {
      title: payload.title,
      description: payload.description,
      thumbnail_url: payload.thumbnail_url,
      is_published: payload.is_published,
    });
    return { message: 'Course updated' };
  }

  async publish(instructorId, courseId) {
    const existing = await courseRepo.findById(courseId);
    if (!existing) throw { status: 404, message: 'Course not found' };
    if (existing.instructor_id !== instructorId) {
      throw { status: 403, message: 'Not authorized to publish this course' };
    }
    await courseRepo.publish(courseId);
    return { message: 'Course published' };
  }

  async delete(instructorId, courseId) {
    const existing = await courseRepo.findById(courseId);
    if (!existing) throw { status: 404, message: 'Course not found' };
    if (existing.instructor_id !== instructorId) {
      throw { status: 403, message: 'Not authorized to delete this course' };
    }
    await courseRepo.delete(courseId);
    return { message: 'Course deleted' };
  }
}

module.exports = new CourseService();

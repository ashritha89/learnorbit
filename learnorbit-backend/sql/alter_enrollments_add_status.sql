-- sql/alter_enrollments_add_status.sql
-- Migration to add status column and indexes to enrollments table

ALTER TABLE enrollments
  ADD COLUMN IF NOT EXISTS status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending' AFTER enrolled_at;

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_enrollment_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_status ON enrollments(status);

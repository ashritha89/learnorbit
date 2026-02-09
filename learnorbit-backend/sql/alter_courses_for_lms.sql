-- sql/alter_courses_for_lms.sql
-- Add new columns to courses table for LearnOrbit LMS
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS instructor_id BIGINT UNSIGNED NOT NULL AFTER id,
  ADD COLUMN IF NOT EXISTS thumbnail_url VARCHAR(512) NULL AFTER description,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT FALSE AFTER is_active;

-- Optional: add foreign key constraint to users table
ALTER TABLE courses
  ADD CONSTRAINT fk_courses_instructor FOREIGN KEY (instructor_id) REFERENCES users(id);

-- sql/alter_courses_add_fields.sql
-- Add missing columns required by the new Course module
ALTER TABLE courses
  ADD COLUMN instructor_id BIGINT UNSIGNED NOT NULL AFTER id,
  ADD COLUMN thumbnail_url VARCHAR(512) NULL AFTER description,
  ADD COLUMN is_published BOOLEAN NOT NULL DEFAULT FALSE AFTER is_active;

-- Ensure foreign key constraint to users table
ALTER TABLE courses
  ADD CONSTRAINT fk_courses_instructor FOREIGN KEY (instructor_id) REFERENCES users(id);

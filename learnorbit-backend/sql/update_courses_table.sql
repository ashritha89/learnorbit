-- sql/update_courses_table.sql
-- Migration to add missing columns to courses table for LearnOrbit LMS
-- Adds instructor_id, thumbnail_url, and is_published columns if they do not exist.

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS instructor_id BIGINT UNSIGNED NOT NULL AFTER id,
  ADD COLUMN IF NOT EXISTS thumbnail_url VARCHAR(512) NULL AFTER description,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT FALSE AFTER is_active;

-- Add foreign key constraint for instructor_id linking to users table
ALTER TABLE courses
  ADD CONSTRAINT fk_courses_instructor FOREIGN KEY (instructor_id) REFERENCES users(id);

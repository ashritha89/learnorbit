-- lessons table alteration for provider, embed_url, is_deleted fields
ALTER TABLE lessons
  ADD COLUMN provider ENUM('youtube','vimeo','mp4','external') NULL AFTER type,
  ADD COLUMN embed_url TEXT NULL AFTER content,
  ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE AFTER order_index;

-- Add indexes if not already present
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(order_index);

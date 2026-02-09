-- lessons table alteration for provider support
ALTER TABLE lessons
  ADD COLUMN provider ENUM('youtube','vimeo','mp4','external') NULL,
  ADD COLUMN embed_url TEXT NULL,
  ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;

-- Indexes for new columns (if needed)
CREATE INDEX idx_lessons_provider ON lessons(provider);

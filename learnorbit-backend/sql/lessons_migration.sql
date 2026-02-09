-- lessons table migration
CREATE TABLE IF NOT EXISTS lessons (
  provider ENUM('youtube','vimeo','mp4','external') NULL,
  embed_url TEXT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  type ENUM('video','text','pdf','link') NOT NULL,
  content TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_lessons_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Indexes for efficient queries
CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_lessons_course_order ON lessons(course_id, order_index);

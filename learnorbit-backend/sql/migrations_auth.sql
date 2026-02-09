-- migrations/auth_tables.sql
-- Add columns for failed login tracking to admin_users
ALTER TABLE admin_users
  ADD COLUMN failed_login_attempts INT NOT NULL DEFAULT 0,
  ADD COLUMN lock_until DATETIME NULL;

-- Refresh token table (one‑time use, rotated)
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(512) NOT NULL,
  admin_id INT NOT NULL,
  issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  revoked BOOLEAN NOT NULL DEFAULT FALSE,
  created_by_ip VARCHAR(45) NULL,
  revoked_by_ip VARCHAR(45) NULL,
  replaced_by_token VARCHAR(512) NULL,
  CONSTRAINT fk_refresh_admin FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE,
  INDEX idx_token (token)
) ENGINE=InnoDB;

-- Audit log table (immutable)
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NULL,
  event_type ENUM('login_success','login_failure','logout','token_refresh','admin_action') NOT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  details JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_admin (admin_id),
  INDEX idx_event (event_type)
) ENGINE=InnoDB;

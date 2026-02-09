-- ============================================
-- LearnOrbit LMS - Unified Users Table
-- ============================================

-- Drop old admin_users table if exists
DROP TABLE IF EXISTS admin_users;

-- Create unified users table with role-based access
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- Basic Information
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  
  -- Role-Based Access Control
  role ENUM('admin', 'instructor', 'student') NOT NULL DEFAULT 'student',
  
  -- Account Status
  is_active BOOLEAN DEFAULT TRUE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255) DEFAULT NULL,
  email_verification_expires_at DATETIME DEFAULT NULL,
  
  -- Security - Account Locking
  failed_login_attempts INT DEFAULT 0,
  locked_until DATETIME DEFAULT NULL,
  
  -- Password Reset
  password_reset_token VARCHAR(255) DEFAULT NULL,
  password_reset_expires_at DATETIME DEFAULT NULL,
  
  -- Profile Information
  avatar_url VARCHAR(500) DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  
  -- Instructor-specific fields
  expertise TEXT DEFAULT NULL COMMENT 'Comma-separated list of expertise areas',
  years_of_experience INT DEFAULT NULL,
  linkedin_url VARCHAR(500) DEFAULT NULL,
  
  -- Student-specific fields
  enrollment_date DATE DEFAULT NULL,
  student_id VARCHAR(50) DEFAULT NULL UNIQUE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP NULL DEFAULT NULL,
  
  -- Indexes for performance
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_is_active (is_active),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Refresh Tokens Table (Updated)
-- ============================================

DROP TABLE IF EXISTS refresh_tokens;

CREATE TABLE refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked BOOLEAN DEFAULT FALSE,
  revoked_at TIMESTAMP NULL DEFAULT NULL,
  replaced_by_token VARCHAR(255) DEFAULT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Audit Logs Table (Updated)
-- ============================================

DROP TABLE IF EXISTS audit_logs;

CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  event_type VARCHAR(100) NOT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  details JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_event_type (event_type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Seed Data - Default Admin User
-- ============================================

-- Create default admin user
-- Password: Admin@123 (CHANGE THIS IN PRODUCTION!)
INSERT INTO users (name, email, password_hash, role, is_active, is_email_verified)
VALUES (
  'System Administrator',
  'admin@learnorbit.com',
  '$2b$10$YourHashedPasswordHere', -- Replace with actual bcrypt hash
  'admin',
  TRUE,
  TRUE
);

-- ============================================
-- Sample Data for Testing
-- ============================================

-- Sample Instructor
INSERT INTO users (
  name, email, password_hash, role, is_active, is_email_verified,
  expertise, years_of_experience, linkedin_url
) VALUES (
  'John Doe',
  'john.instructor@learnorbit.com',
  '$2b$10$YourHashedPasswordHere',
  'instructor',
  TRUE,
  TRUE,
  'Web Development,JavaScript,React',
  5,
  'https://linkedin.com/in/johndoe'
);

-- Sample Student
INSERT INTO users (
  name, email, password_hash, role, is_active, is_email_verified,
  enrollment_date, student_id
) VALUES (
  'Jane Smith',
  'jane.student@learnorbit.com',
  '$2b$10$YourHashedPasswordHere',
  'student',
  TRUE,
  TRUE,
  CURDATE(),
  'STU2026001'
);

-- ============================================
-- Useful Queries for Administration
-- ============================================

-- Count users by role
-- SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- Find locked accounts
-- SELECT id, name, email, role, locked_until 
-- FROM users 
-- WHERE locked_until > NOW();

-- Find unverified emails
-- SELECT id, name, email, role, created_at 
-- FROM users 
-- WHERE is_email_verified = FALSE;

-- Recent registrations
-- SELECT id, name, email, role, created_at 
-- FROM users 
-- ORDER BY created_at DESC 
-- LIMIT 10;

-- Active sessions (non-revoked refresh tokens)
-- SELECT u.name, u.email, rt.created_at, rt.ip_address
-- FROM refresh_tokens rt
-- JOIN users u ON rt.user_id = u.id
-- WHERE rt.revoked = FALSE AND rt.expires_at > NOW();

-- Create Marketing Tables for Waitlist, Contact, and Feedback
-- Database: MySQL
-- Note: Requires MySQL 5.7.8+ for JSON support.
-- Note: UUIDs are stored as CHAR(36). Application should generate UUIDs or use UUID() function on insert.
--       MySQL 8.0.13+ supports DEFAULT (UUID()), but strict sql mode might require explicit insertion.

-- ==================================================
-- 1️⃣ marketing_waitlist_users
-- ==================================================
CREATE TABLE IF NOT EXISTS marketing_waitlist_users (
    id CHAR(36) NOT NULL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('student', 'instructor', 'course_creator', 'institute', 'corporate_trainer') NOT NULL,
    current_lms VARCHAR(255) NULL,
    frustrations JSON NULL,
    desired_features JSON NULL,
    pricing_range VARCHAR(100) NULL,
    early_access BOOLEAN DEFAULT FALSE,
    beta_tester BOOLEAN DEFAULT FALSE,
    source VARCHAR(100) NULL,
    status ENUM('new', 'contacted', 'converted') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_mw_email (email),
    INDEX idx_mw_status (status),
    INDEX idx_mw_role (role)
) ENGINE=InnoDB COMMENT='Stores users who have signed up for the pre-launch waitlist';

-- ==================================================
-- 2️⃣ marketing_contact_messages
-- ==================================================
CREATE TABLE IF NOT EXISTS marketing_contact_messages (
    id CHAR(36) NOT NULL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'replied', 'archived') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_mc_email (email),
    INDEX idx_mc_status (status)
) ENGINE=InnoDB COMMENT='Stores standard contact form submissions';

-- ==================================================
-- 3️⃣ marketing_feedback_submissions
-- ==================================================
CREATE TABLE IF NOT EXISTS marketing_feedback_submissions (
    id CHAR(36) NOT NULL PRIMARY KEY,
    user_type ENUM('student', 'instructor') NOT NULL,
    biggest_problem TEXT NULL,
    missing_feature TEXT NULL,
    improvement_suggestion TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Stores feedback collected from users during LMS usage or beta testing';

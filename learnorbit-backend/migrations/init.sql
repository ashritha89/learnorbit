-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--------------------------------
-- 1️⃣ marketing_waitlist_users
--------------------------------

DO $$ BEGIN
    CREATE TYPE role_enum AS ENUM (
        'student',
        'instructor',
        'course_creator',
        'institute',
        'corporate_trainer'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE waitlist_status_enum AS ENUM (
        'new',
        'contacted',
        'converted'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS marketing_waitlist_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role role_enum NOT NULL,
  current_lms VARCHAR(255),
  frustrations JSONB,
  desired_features JSONB,
  pricing_range VARCHAR(100),
  early_access BOOLEAN DEFAULT false,
  beta_tester BOOLEAN DEFAULT false,
  source VARCHAR(100),
  status waitlist_status_enum DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON marketing_waitlist_users(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_role ON marketing_waitlist_users(role);

--------------------------------
-- 2️⃣ marketing_contact_messages
--------------------------------

DO $$ BEGIN
    CREATE TYPE contact_status_enum AS ENUM (
        'new',
        'replied',
        'archived'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS marketing_contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status contact_status_enum DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--------------------------------
-- 3️⃣ marketing_feedback_submissions
--------------------------------

DO $$ BEGIN
    CREATE TYPE feedback_user_enum AS ENUM (
        'student',
        'instructor'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS marketing_feedback_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_type feedback_user_enum NOT NULL,
  biggest_problem TEXT,
  missing_feature TEXT,
  improvement_suggestion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

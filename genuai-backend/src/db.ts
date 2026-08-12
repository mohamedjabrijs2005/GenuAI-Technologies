import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect(async (err, client, release) => {
  if (err) {
    console.error('[DB] Database connection error:', err.message);
  } else {
    console.log('[DB] Connected to Supabase PostgreSQL successfully!');
    try {
      // 1. Ensure users table exists with all standard columns
      await client?.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role VARCHAR(50) DEFAULT 'candidate',
          phone VARCHAR(50),
          college VARCHAR(255),
          github VARCHAR(255),
          linkedin VARCHAR(255),
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW()
        );
        ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS college VARCHAR(255);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS github VARCHAR(255);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin VARCHAR(255);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
      `);

      // 2. Ensure jobs table exists
      await client?.query(`
        CREATE TABLE IF NOT EXISTS jobs (
          id SERIAL PRIMARY KEY,
          company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          department VARCHAR(100) DEFAULT 'Engineering',
          description TEXT NOT NULL,
          skills VARCHAR(255),
          skills_required VARCHAR(255),
          location VARCHAR(255) DEFAULT 'Remote',
          employment_type VARCHAR(50) DEFAULT 'Full-time',
          experience_level VARCHAR(50) DEFAULT 'Mid-Level',
          salary_min INTEGER DEFAULT 0,
          salary_max INTEGER DEFAULT 0,
          status VARCHAR(50) DEFAULT 'active',
          assessment_config JSONB DEFAULT '{"aptitude": true, "coding": true, "communication": true, "ai_interview": true}',
          created_at TIMESTAMP DEFAULT NOW()
        );
        ALTER TABLE jobs ADD COLUMN IF NOT EXISTS department VARCHAR(100) DEFAULT 'Engineering';
        ALTER TABLE jobs ADD COLUMN IF NOT EXISTS employment_type VARCHAR(50) DEFAULT 'Full-time';
        ALTER TABLE jobs ADD COLUMN IF NOT EXISTS experience_level VARCHAR(50) DEFAULT 'Mid-Level';
        ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
        ALTER TABLE jobs ADD COLUMN IF NOT EXISTS assessment_config JSONB DEFAULT '{"aptitude": true, "coding": true, "communication": true, "ai_interview": true}';
      `);

      // 3. Ensure assessments table exists
      await client?.query(`
        CREATE TABLE IF NOT EXISTS assessments (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          role VARCHAR(255) DEFAULT 'Software Engineer',
          overall_score INTEGER DEFAULT 0,
          ats_score INTEGER DEFAULT 0,
          test_score INTEGER DEFAULT 0,
          interview_score INTEGER DEFAULT 0,
          communication_score INTEGER DEFAULT 0,
          coding_score INTEGER DEFAULT 0,
          verdict VARCHAR(50),
          triangle_status VARCHAR(50) DEFAULT 'VERIFIED',
          integrity_details JSONB DEFAULT '{"face_match": true, "liveness": true, "multiple_person": false, "suspicious_activity": false}',
          company_ids INTEGER[] DEFAULT '{}',
          active_company_id INTEGER,
          created_at TIMESTAMP DEFAULT NOW()
        );
        ALTER TABLE assessments ADD COLUMN IF NOT EXISTS communication_score INTEGER DEFAULT 0;
        ALTER TABLE assessments ADD COLUMN IF NOT EXISTS coding_score INTEGER DEFAULT 0;
        ALTER TABLE assessments ADD COLUMN IF NOT EXISTS integrity_details JSONB DEFAULT '{"face_match": true, "liveness": true, "multiple_person": false, "suspicious_activity": false}';
        ALTER TABLE assessments ADD COLUMN IF NOT EXISTS active_company_id INTEGER;
      `);

      // 4. Ensure interviews table exists
      await client?.query(`
        CREATE TABLE IF NOT EXISTS interviews (
          id SERIAL PRIMARY KEY,
          company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          candidate_name VARCHAR(255),
          candidate_email VARCHAR(255),
          job_title VARCHAR(255) DEFAULT 'Software Engineer',
          interview_type VARCHAR(50) DEFAULT 'Technical',
          scheduled_at TIMESTAMP NOT NULL,
          status VARCHAR(50) DEFAULT 'scheduled',
          meeting_link VARCHAR(500),
          interviewer_name VARCHAR(255) DEFAULT 'Hiring Manager',
          ai_summary TEXT,
          score INTEGER,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      // 5. Ensure projects table exists
      await client?.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          deadline TIMESTAMP,
          submission_url TEXT,
          score INTEGER,
          feedback TEXT,
          status VARCHAR(50) DEFAULT 'assigned',
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      // 6. Ensure institutions table exists
      await client?.query(`
        CREATE TABLE IF NOT EXISTS institutions (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          code VARCHAR(50) UNIQUE,
          location VARCHAR(255),
          contact_email VARCHAR(255),
          phone VARCHAR(50),
          status VARCHAR(50) DEFAULT 'active',
          candidates_count INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      // 7. Ensure audit_logs table exists
      await client?.query(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER,
          user_email VARCHAR(255),
          action VARCHAR(100) NOT NULL,
          resource VARCHAR(100) NOT NULL,
          details TEXT,
          ip_address VARCHAR(100) DEFAULT '127.0.0.1',
          status VARCHAR(50) DEFAULT 'success',
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      // 8. Ensure system_notifications table exists
      await client?.query(`
        CREATE TABLE IF NOT EXISTS system_notifications (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          audience VARCHAR(50) DEFAULT 'all',
          priority VARCHAR(50) DEFAULT 'info',
          created_by VARCHAR(255) DEFAULT 'System Admin',
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      // 9. Ensure company_profiles table exists
      await client?.query(`
        CREATE TABLE IF NOT EXISTS company_profiles (
          id SERIAL PRIMARY KEY,
          user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
          company_name VARCHAR(255),
          logo_url TEXT,
          industry VARCHAR(100) DEFAULT 'Technology',
          website VARCHAR(255),
          description TEXT,
          location VARCHAR(255) DEFAULT 'Bengaluru, India',
          company_size VARCHAR(50) DEFAULT '50-200 employees',
          contact_email VARCHAR(255),
          team_members JSONB DEFAULT '[]',
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      // 10. Ensure question_bank table exists
      await client?.query(`
        CREATE TABLE IF NOT EXISTS question_bank (
          id SERIAL PRIMARY KEY,
          question_text TEXT NOT NULL,
          question_type VARCHAR(50) DEFAULT 'MCQ',
          skill VARCHAR(100) DEFAULT 'Problem Solving',
          difficulty VARCHAR(50) DEFAULT 'Medium',
          role VARCHAR(100) DEFAULT 'Software Engineer',
          time_limit_sec INTEGER DEFAULT 60,
          status VARCHAR(50) DEFAULT 'active',
          options JSONB DEFAULT '[]',
          correct_answer TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      console.log('[DB] Verified all GenuAI platform enterprise tables in Supabase PostgreSQL.');
    } catch (tableErr: any) {
      console.error('[DB] Error initializing enterprise tables:', tableErr.message);
    } finally {
      release?.();
    }
  }
});

export default pool;

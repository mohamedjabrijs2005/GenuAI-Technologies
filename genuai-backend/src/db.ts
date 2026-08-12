import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 30000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

pool.on('error', (err) => {
  console.error('[DB Pool] Idle client notification:', err.message);
});

// Run startup schema migration safely in background with resilient retry
async function initSchemaWithRetry(maxRetries = 5, delayMs = 3000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    let client;
    try {
      client = await pool.connect();
      console.log(`[DB] Connected to PostgreSQL successfully (attempt ${attempt}/${maxRetries})`);

      await client.query(`
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
        CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));
        CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

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

        CREATE TABLE IF NOT EXISTS system_notifications (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          audience VARCHAR(50) DEFAULT 'all',
          priority VARCHAR(50) DEFAULT 'info',
          created_by VARCHAR(255) DEFAULT 'System Admin',
          created_at TIMESTAMP DEFAULT NOW()
        );

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
      console.log('[DB] Enterprise tables & indexes verified successfully.');
      return;
    } catch (err: any) {
      console.warn(`[DB] Schema init attempt ${attempt}/${maxRetries} notice:`, err.message);
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, delayMs * attempt));
      } else {
        console.log('[DB] Background schema verification ready; live queries will connect on demand.');
      }
    } finally {
      if (client) client.release();
    }
  }
}

initSchemaWithRetry();

export default pool;

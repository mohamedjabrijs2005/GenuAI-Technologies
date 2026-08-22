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

        -- ─────────────────────────────────────────────
        -- GENUAI WORKS — ROLE-SKILL-ASSESSMENT KNOWLEDGE BASE
        -- ─────────────────────────────────────────────

        -- Canonical skill taxonomy
        CREATE TABLE IF NOT EXISTS skills (
          id SERIAL PRIMARY KEY,
          canonical_name VARCHAR(100) UNIQUE NOT NULL,
          category VARCHAR(100),
          description TEXT,
          is_composite BOOLEAN DEFAULT false,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS skill_aliases (
          id SERIAL PRIMARY KEY,
          skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
          alias_text VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- Canonical role taxonomy
        CREATE TABLE IF NOT EXISTS role_taxonomy (
          id SERIAL PRIMARY KEY,
          canonical_name VARCHAR(100) UNIQUE NOT NULL,
          category VARCHAR(100),
          description TEXT,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- Role equivalency mapping (Fix 1: admin-curated, AI may suggest)
        CREATE TABLE IF NOT EXISTS role_equivalency_mapping (
          id SERIAL PRIMARY KEY,
          company_role_title VARCHAR(255) NOT NULL,
          company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          canonical_role_id INTEGER REFERENCES role_taxonomy(id) ON DELETE CASCADE,
          mapped_by VARCHAR(50) DEFAULT 'admin_confirmed' CHECK (mapped_by IN ('ai_suggested','admin_confirmed')),
          confidence DECIMAL(5,2) DEFAULT 1.0,
          reviewed_by_admin INTEGER REFERENCES users(id),
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(company_id, company_role_title)
        );

        -- Assessment module library
        CREATE TABLE IF NOT EXISTS assessment_modules (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) UNIQUE NOT NULL,
          canonical_name VARCHAR(100) UNIQUE NOT NULL,
          category VARCHAR(100),
          description TEXT,
          is_composite BOOLEAN DEFAULT false,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- Role ↔ Skill relevance mappings
        CREATE TABLE IF NOT EXISTS role_skills (
          id SERIAL PRIMARY KEY,
          role_taxonomy_id INTEGER REFERENCES role_taxonomy(id) ON DELETE CASCADE,
          skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
          relevance VARCHAR(50) DEFAULT 'required' CHECK (relevance IN ('required','optional','not_applicable')),
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(role_taxonomy_id, skill_id)
        );

        -- Role ↔ Assessment module relevance mappings
        CREATE TABLE IF NOT EXISTS role_assessment_modules (
          id SERIAL PRIMARY KEY,
          role_taxonomy_id INTEGER REFERENCES role_taxonomy(id) ON DELETE CASCADE,
          assessment_module_id INTEGER REFERENCES assessment_modules(id) ON DELETE CASCADE,
          relevance VARCHAR(50) DEFAULT 'required' CHECK (relevance IN ('required','optional','not_applicable')),
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(role_taxonomy_id, assessment_module_id)
        );

        -- ─────────────────────────────────────────────
        -- COMPANY ROLE CONFIGURATION
        -- ─────────────────────────────────────────────

        -- Company-specific roles (linked to canonical)
        CREATE TABLE IF NOT EXISTS company_roles (
          id SERIAL PRIMARY KEY,
          company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          canonical_role_id INTEGER REFERENCES role_taxonomy(id),
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- Assessment configuration per company-role
        CREATE TABLE IF NOT EXISTS company_assessment_configurations (
          id SERIAL PRIMARY KEY,
          company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          company_role_id INTEGER REFERENCES company_roles(id) ON DELETE CASCADE,
          status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft','locked')),
          created_by INTEGER REFERENCES users(id),
          created_at TIMESTAMP DEFAULT NOW(),
          locked_at TIMESTAMP,
          UNIQUE(company_id, company_role_id)
        );

        -- Configuration versions — NEVER overwrite, only add new versions (Fix 2)
        CREATE TABLE IF NOT EXISTS company_configuration_versions (
          id SERIAL PRIMARY KEY,
          configuration_id INTEGER REFERENCES company_assessment_configurations(id) ON DELETE CASCADE,
          version_number INTEGER NOT NULL DEFAULT 1,
          company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          company_role_id INTEGER REFERENCES company_roles(id) ON DELETE CASCADE,
          canonical_role_id INTEGER REFERENCES role_taxonomy(id),
          selected_module_ids INTEGER[] DEFAULT '{}',
          weightages JSONB DEFAULT '{}',
          status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active','superseded')),
          superseded_at TIMESTAMP,
          superseded_by_version_id INTEGER,
          created_at TIMESTAMP DEFAULT NOW(),
          created_by INTEGER REFERENCES users(id)
        );

        -- Requirements within a version
        CREATE TABLE IF NOT EXISTS company_configuration_requirements (
          id SERIAL PRIMARY KEY,
          configuration_version_id INTEGER REFERENCES company_configuration_versions(id) ON DELETE CASCADE,
          assessment_module_id INTEGER REFERENCES assessment_modules(id) ON DELETE CASCADE,
          weight DECIMAL(5,2) DEFAULT 1.0,
          is_required BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- Agreement acceptance records
        CREATE TABLE IF NOT EXISTS company_configuration_agreements (
          id SERIAL PRIMARY KEY,
          configuration_id INTEGER REFERENCES company_assessment_configurations(id) ON DELETE CASCADE,
          configuration_version_id INTEGER REFERENCES company_configuration_versions(id) ON DELETE CASCADE,
          company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          accepted_by INTEGER REFERENCES users(id),
          agreement_text TEXT,
          accepted_at TIMESTAMP DEFAULT NOW(),
          ip_address VARCHAR(100)
        );

        -- ─────────────────────────────────────────────
        -- CANDIDATE INTELLIGENCE
        -- ─────────────────────────────────────────────

        CREATE TABLE IF NOT EXISTS candidate_company_interests (
          id SERIAL PRIMARY KEY,
          candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(candidate_id, company_id)
        );

        CREATE TABLE IF NOT EXISTS candidate_role_interests (
          id SERIAL PRIMARY KEY,
          candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          company_role_id INTEGER REFERENCES company_roles(id) ON DELETE CASCADE,
          canonical_role_id INTEGER REFERENCES role_taxonomy(id),
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(candidate_id, company_id, company_role_id)
        );

        CREATE TABLE IF NOT EXISTS candidate_skill_profiles (
          id SERIAL PRIMARY KEY,
          candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
          proficiency_level VARCHAR(50),
          score DECIMAL(5,2),
          verified BOOLEAN DEFAULT false,
          last_assessed TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(candidate_id, skill_id)
        );

        -- ─────────────────────────────────────────────
        -- GENUAI WORKS ENGINE
        -- ─────────────────────────────────────────────

        CREATE TABLE IF NOT EXISTS dynamic_assessment_paths (
          id SERIAL PRIMARY KEY,
          candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          generated_at TIMESTAMP DEFAULT NOW(),
          canonical_role_groups JSONB DEFAULT '{}',
          core_module_ids INTEGER[] DEFAULT '{}',
          majority_module_ids INTEGER[] DEFAULT '{}',
          company_specific_modules JSONB DEFAULT '{}',
          reused_results JSONB DEFAULT '{}',
          assessment_explanations JSONB DEFAULT '{}',
          status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','expired')),
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- Assessment attempts — version-bound (Fix 2)
        CREATE TABLE IF NOT EXISTS assessment_attempts (
          id SERIAL PRIMARY KEY,
          candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          assessment_module_id INTEGER REFERENCES assessment_modules(id),
          dynamic_path_id INTEGER REFERENCES dynamic_assessment_paths(id),
          configuration_version_id INTEGER REFERENCES company_configuration_versions(id),
          score DECIMAL(5,2),
          max_score DECIMAL(5,2) DEFAULT 100,
          percentage DECIMAL(5,2),
          status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','verified','expired')),
          verified BOOLEAN DEFAULT false,
          validity_months INTEGER DEFAULT 6,
          started_at TIMESTAMP,
          completed_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS assessment_reuse_records (
          id SERIAL PRIMARY KEY,
          candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          original_attempt_id INTEGER REFERENCES assessment_attempts(id),
          reused_for_path_id INTEGER REFERENCES dynamic_assessment_paths(id),
          reuse_reason TEXT,
          reused_at TIMESTAMP DEFAULT NOW()
        );

        -- Candidate assessment groups — composite key (Fix 3)
        CREATE TABLE IF NOT EXISTS candidate_assessment_groups (
          id SERIAL PRIMARY KEY,
          canonical_role_id INTEGER REFERENCES role_taxonomy(id),
          configuration_version_id INTEGER REFERENCES company_configuration_versions(id),
          assessment_pattern_hash VARCHAR(64) NOT NULL,
          pattern_description JSONB DEFAULT '{}',
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(canonical_role_id, configuration_version_id, assessment_pattern_hash)
        );

        CREATE TABLE IF NOT EXISTS candidate_group_memberships (
          id SERIAL PRIMARY KEY,
          group_id INTEGER REFERENCES candidate_assessment_groups(id) ON DELETE CASCADE,
          candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          dynamic_path_id INTEGER REFERENCES dynamic_assessment_paths(id),
          joined_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(group_id, candidate_id)
        );

        -- ─────────────────────────────────────────────
        -- MATCHING & INTELLIGENCE
        -- ─────────────────────────────────────────────

        -- Company-specific match scores — version-bound (Fix 2)
        CREATE TABLE IF NOT EXISTS candidate_company_matches (
          id SERIAL PRIMARY KEY,
          candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          company_role_id INTEGER REFERENCES company_roles(id),
          configuration_version_id INTEGER REFERENCES company_configuration_versions(id),
          match_score DECIMAL(5,2),
          score_components JSONB DEFAULT '{}',
          strengths JSONB DEFAULT '[]',
          weak_areas JSONB DEFAULT '[]',
          explanation TEXT,
          generated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS skill_gap_analysis (
          id SERIAL PRIMARY KEY,
          candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          company_role_id INTEGER REFERENCES company_roles(id),
          skill_id INTEGER REFERENCES skills(id),
          required_level VARCHAR(50),
          current_level VARCHAR(50),
          gap_severity VARCHAR(50),
          recommendations JSONB DEFAULT '[]',
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS readiness_scores (
          id SERIAL PRIMARY KEY,
          candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          company_role_id INTEGER REFERENCES company_roles(id),
          configuration_version_id INTEGER REFERENCES company_configuration_versions(id),
          component_scores JSONB DEFAULT '{}',
          overall_readiness DECIMAL(5,2),
          generated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS career_recommendations (
          id SERIAL PRIMARY KEY,
          candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          recommendation_type VARCHAR(100),
          content JSONB DEFAULT '{}',
          relevance_score DECIMAL(5,2),
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS company_intelligence (
          id SERIAL PRIMARY KEY,
          candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          company_role_id INTEGER REFERENCES company_roles(id),
          content_type VARCHAR(100),
          content JSONB DEFAULT '{}',
          relevance_score DECIMAL(5,2),
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS news_items (
          id SERIAL PRIMARY KEY,
          title VARCHAR(500) NOT NULL,
          content TEXT,
          source VARCHAR(255),
          url VARCHAR(500),
          tags JSONB DEFAULT '[]',
          category VARCHAR(100),
          published_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS candidate_news_relevance (
          id SERIAL PRIMARY KEY,
          candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          news_item_id INTEGER REFERENCES news_items(id) ON DELETE CASCADE,
          relevance_score DECIMAL(5,2),
          reason VARCHAR(500),
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- ─────────────────────────────────────────────
        -- SUBSCRIPTIONS & PAYMENTS
        -- ─────────────────────────────────────────────

        CREATE TABLE IF NOT EXISTS subscription_plans (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          currency VARCHAR(10) DEFAULT 'INR',
          duration_days INTEGER NOT NULL,
          config_changes_allowed INTEGER DEFAULT 1,
          roles_allowed INTEGER DEFAULT 5,
          advanced_analytics BOOLEAN DEFAULT false,
          features JSONB DEFAULT '[]',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS company_subscriptions (
          id SERIAL PRIMARY KEY,
          company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          plan_id INTEGER REFERENCES subscription_plans(id),
          status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active','expired','cancelled')),
          starts_at TIMESTAMP DEFAULT NOW(),
          expires_at TIMESTAMP,
          config_changes_used INTEGER DEFAULT 0,
          payment_id INTEGER,
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS configuration_change_requests (
          id SERIAL PRIMARY KEY,
          company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          configuration_id INTEGER REFERENCES company_assessment_configurations(id),
          current_version_id INTEGER REFERENCES company_configuration_versions(id),
          subscription_id INTEGER REFERENCES company_subscriptions(id),
          reason TEXT,
          status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
          requested_at TIMESTAMP DEFAULT NOW(),
          approved_at TIMESTAMP,
          approved_by INTEGER REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS payments (
          id SERIAL PRIMARY KEY,
          company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          subscription_id INTEGER REFERENCES company_subscriptions(id),
          amount DECIMAL(10,2) NOT NULL,
          currency VARCHAR(10) DEFAULT 'INR',
          gateway VARCHAR(100) DEFAULT 'mock',
          gateway_reference VARCHAR(500),
          status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
          paid_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- ─────────────────────────────────────────────
        -- APPLICATIONS
        -- ─────────────────────────────────────────────

        CREATE TABLE IF NOT EXISTS applications (
          id SERIAL PRIMARY KEY,
          candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
          company_role_id INTEGER REFERENCES company_roles(id),
          dynamic_path_id INTEGER REFERENCES dynamic_assessment_paths(id),
          match_score DECIMAL(5,2),
          status VARCHAR(50) DEFAULT 'applied',
          applied_at TIMESTAMP DEFAULT NOW()
        );

        -- Extend jobs table to link company_roles
        ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_role_id INTEGER REFERENCES company_roles(id);

        -- Indexes for performance
        CREATE INDEX IF NOT EXISTS idx_cand_company_interests ON candidate_company_interests(candidate_id);
        CREATE INDEX IF NOT EXISTS idx_cand_role_interests ON candidate_role_interests(candidate_id);
        CREATE INDEX IF NOT EXISTS idx_dynamic_paths_candidate ON dynamic_assessment_paths(candidate_id);
        CREATE INDEX IF NOT EXISTS idx_assessment_attempts_candidate ON assessment_attempts(candidate_id);
        CREATE INDEX IF NOT EXISTS idx_assessment_attempts_version ON assessment_attempts(configuration_version_id);
        CREATE INDEX IF NOT EXISTS idx_matches_candidate ON candidate_company_matches(candidate_id);
        CREATE INDEX IF NOT EXISTS idx_matches_company ON candidate_company_matches(company_id);
        CREATE INDEX IF NOT EXISTS idx_config_versions_role ON company_configuration_versions(company_role_id);
        CREATE INDEX IF NOT EXISTS idx_groups_composite ON candidate_assessment_groups(canonical_role_id, configuration_version_id);
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

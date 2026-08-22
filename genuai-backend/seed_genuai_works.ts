/**
 * GenuAI Works — Demo Seed Script
 * Run: npx ts-node seed_genuai_works.ts
 *
 * Seeds:
 *  1. Assessment modules (GenuAI Skill Test, Coding, DSA, etc.)
 *  2. Role taxonomy (SOFTWARE_ENGINEER, SALES_EXECUTIVE, DATA_ANALYST, etc.)
 *  3. Canonical skills
 *  4. Demo company users: Zoho, Apple, Google
 *  5. Company roles + locked V1 configurations
 *  6. Role equivalency mappings (admin-confirmed)
 *  7. Subscription plans (3 tiers)
 */

import pool from './src/db';
import bcrypt from 'bcryptjs';

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('[Seed] Starting GenuAI Works seed...');

    // ─── 1. Assessment Modules ────────────────────────────────────────────────
    const modules = [
      { name: 'GenuAI Skill Test',     canonical_name: 'GENUAI_SKILL_TEST',     category: 'core',          description: 'AMCAT-style modular core assessment. Tests aptitude, verbal, and domain fundamentals.' },
      { name: 'Coding Assessment',      canonical_name: 'CODING',                category: 'technical',     description: 'Programming proficiency test with real code execution.' },
      { name: 'DSA',                    canonical_name: 'DSA',                   category: 'technical',     description: 'Data Structures and Algorithms assessment.' },
      { name: 'Problem Solving',        canonical_name: 'PROBLEM_SOLVING',       category: 'technical',     description: 'Analytical problem solving and logical thinking.' },
      { name: 'Communication',          canonical_name: 'COMMUNICATION',         category: 'soft_skill',    description: 'Verbal and written communication evaluation.' },
      { name: 'Group Discussion',       canonical_name: 'GROUP_DISCUSSION',      category: 'soft_skill',    description: 'Collaborative discussion and team communication assessment.' },
      { name: 'AI Interview',           canonical_name: 'INTERVIEW',             category: 'interview',     description: 'AI-powered structured interview simulation.' },
      { name: 'Aptitude',               canonical_name: 'APTITUDE',              category: 'aptitude',      description: 'Quantitative aptitude and numerical reasoning.' },
      { name: 'Logical Reasoning',      canonical_name: 'LOGICAL_REASONING',     category: 'aptitude',      description: 'Logical and analytical reasoning assessment.' },
      { name: 'SQL/Data Analysis',      canonical_name: 'SQL_DATA_ANALYSIS',     category: 'technical',     description: 'SQL proficiency and data analysis fundamentals.' },
      { name: 'Project Assessment',     canonical_name: 'PROJECT',               category: 'practical',     description: 'Practical project submission and evaluation.' },
      { name: 'SVAR',                   canonical_name: 'SVAR',                  category: 'soft_skill',    description: 'Spoken Voice Assessment and Rating.' },
      { name: 'Technical Knowledge',    canonical_name: 'TECHNICAL_KNOWLEDGE',   category: 'technical',     description: 'Domain-specific technical knowledge quiz.' },
      { name: 'Portfolio Review',       canonical_name: 'PORTFOLIO',             category: 'practical',     description: 'Design/creative portfolio submission and review.' },
    ];

    const moduleIdMap: Record<string, number> = {};
    for (const m of modules) {
      const res = await client.query(
        `INSERT INTO assessment_modules (name, canonical_name, category, description, is_composite, status)
         VALUES ($1, $2, $3, $4, false, 'active')
         ON CONFLICT (canonical_name) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
         RETURNING id, canonical_name`,
        [m.name, m.canonical_name, m.category, m.description]
      );
      moduleIdMap[m.canonical_name] = res.rows[0].id;
    }
    console.log('[Seed] Assessment modules seeded:', Object.keys(moduleIdMap).length);

    // ─── 2. Canonical Skills ──────────────────────────────────────────────────
    const skills = [
      { canonical_name: 'COMMUNICATION',       category: 'soft_skill',  aliases: ['Communication Skills', 'Verbal Communication', 'Oral Communication'] },
      { canonical_name: 'CODING',              category: 'technical',   aliases: ['Programming', 'Code', 'Software Development'] },
      { canonical_name: 'DSA',                 category: 'technical',   aliases: ['Data Structures', 'Algorithms', 'Data Structures & Algorithms'] },
      { canonical_name: 'PROBLEM_SOLVING',     category: 'cognitive',   aliases: ['Problem Solving Ability', 'Analytical Thinking'] },
      { canonical_name: 'APTITUDE',            category: 'cognitive',   aliases: ['Quantitative Aptitude', 'Numerical Reasoning'] },
      { canonical_name: 'LOGICAL_REASONING',   category: 'cognitive',   aliases: ['Logical Ability', 'Logical Thinking', 'Reasoning'] },
      { canonical_name: 'SQL',                 category: 'technical',   aliases: ['SQL', 'Structured Query Language', 'Database Querying'] },
      { canonical_name: 'DATA_ANALYSIS',       category: 'technical',   aliases: ['Data Analytics', 'Data Analysis'] },
      { canonical_name: 'NEGOTIATION',         category: 'soft_skill',  aliases: ['Negotiation Skills', 'Deal Making'] },
      { canonical_name: 'CUSTOMER_HANDLING',   category: 'soft_skill',  aliases: ['Customer Service', 'Client Handling'] },
      { canonical_name: 'PRESENTATION',        category: 'soft_skill',  aliases: ['Presentation Skills', 'Public Speaking'] },
      { canonical_name: 'DESIGN_THINKING',     category: 'creative',    aliases: ['UX Thinking', 'User-Centered Design'] },
      { canonical_name: 'TECHNICAL_KNOWLEDGE', category: 'technical',   aliases: ['Technical Skills', 'Domain Knowledge'] },
    ];

    const skillIdMap: Record<string, number> = {};
    for (const s of skills) {
      const res = await client.query(
        `INSERT INTO skills (canonical_name, category, status)
         VALUES ($1, $2, 'active')
         ON CONFLICT (canonical_name) DO UPDATE SET category = EXCLUDED.category
         RETURNING id, canonical_name`,
        [s.canonical_name, s.category]
      );
      skillIdMap[s.canonical_name] = res.rows[0].id;
      for (const alias of s.aliases) {
        await client.query(
          `INSERT INTO skill_aliases (skill_id, alias_text) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [res.rows[0].id, alias]
        );
      }
    }
    console.log('[Seed] Canonical skills seeded:', Object.keys(skillIdMap).length);

    // ─── 3. Role Taxonomy ─────────────────────────────────────────────────────
    const roles = [
      { canonical_name: 'SOFTWARE_ENGINEER', category: 'engineering', description: 'Software development and engineering roles' },
      { canonical_name: 'SALES_EXECUTIVE',   category: 'sales',       description: 'Sales and business development roles' },
      { canonical_name: 'DATA_ANALYST',      category: 'analytics',   description: 'Data analysis and business intelligence roles' },
      { canonical_name: 'HR_EXECUTIVE',      category: 'hr',          description: 'Human resources and people management roles' },
      { canonical_name: 'UI_UX_DESIGNER',    category: 'design',      description: 'UI/UX and product design roles' },
    ];

    const roleIdMap: Record<string, number> = {};
    for (const r of roles) {
      const res = await client.query(
        `INSERT INTO role_taxonomy (canonical_name, category, description, status)
         VALUES ($1, $2, $3, 'active')
         ON CONFLICT (canonical_name) DO UPDATE SET description = EXCLUDED.description
         RETURNING id, canonical_name`,
        [r.canonical_name, r.category, r.description]
      );
      roleIdMap[r.canonical_name] = res.rows[0].id;
    }
    console.log('[Seed] Role taxonomy seeded:', Object.keys(roleIdMap).length);

    // ─── 4. Demo Company Users ────────────────────────────────────────────────
    const demoHash = await bcrypt.hash('demo123', 10);
    const demoCompanies = [
      {
        name: 'Zoho Corporation',
        email: 'hr@zoho.demo.genuai',
        company_name: 'Zoho',
        industry: 'Technology',
        website: 'https://zoho.com',
        description: 'Zoho Corporation is an Indian multinational technology company that makes computer software and web-based business tools.',
        location: 'Chennai, India',
        size: '10,000+ employees',
      },
      {
        name: 'Apple Inc.',
        email: 'hr@apple.demo.genuai',
        company_name: 'Apple',
        industry: 'Technology',
        website: 'https://apple.com',
        description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.',
        location: 'Cupertino, CA, USA',
        size: '150,000+ employees',
      },
      {
        name: 'Google LLC',
        email: 'hr@google.demo.genuai',
        company_name: 'Google',
        industry: 'Technology',
        website: 'https://google.com',
        description: 'Google LLC is an American multinational technology company focusing on online advertising, search engine technology, cloud computing, computer software, and AI.',
        location: 'Mountain View, CA, USA',
        size: '100,000+ employees',
      },
    ];

    const companyUserIdMap: Record<string, number> = {};
    for (const co of demoCompanies) {
      const userRes = await client.query(
        `INSERT INTO users (name, email, password_hash, role, status)
         VALUES ($1, $2, $3, 'company', 'active')
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [co.name, co.email, demoHash]
      );
      const userId = userRes.rows[0].id;
      companyUserIdMap[co.company_name] = userId;

      await client.query(
        `INSERT INTO company_profiles (user_id, company_name, industry, website, description, location, company_size)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (user_id) DO UPDATE SET company_name = EXCLUDED.company_name`,
        [userId, co.company_name, co.industry, co.website, co.description, co.location, co.size]
      );
    }
    console.log('[Seed] Demo company users seeded:', Object.keys(companyUserIdMap));

    // ─── 5. Company Roles + Locked V1 Configurations ─────────────────────────
    const companyRoleConfigs = [
      {
        company: 'Zoho',  title: 'Sales Executive',   canonical: 'SALES_EXECUTIVE',
        modules: ['GENUAI_SKILL_TEST', 'COMMUNICATION', 'GROUP_DISCUSSION', 'INTERVIEW'],
        weights: { GENUAI_SKILL_TEST: 0.30, COMMUNICATION: 0.30, GROUP_DISCUSSION: 0.20, INTERVIEW: 0.20 },
      },
      {
        company: 'Zoho',  title: 'Software Developer', canonical: 'SOFTWARE_ENGINEER',
        modules: ['GENUAI_SKILL_TEST', 'CODING', 'DSA', 'INTERVIEW'],
        weights: { GENUAI_SKILL_TEST: 0.25, CODING: 0.35, DSA: 0.25, INTERVIEW: 0.15 },
      },
      {
        company: 'Apple', title: 'Software Engineer', canonical: 'SOFTWARE_ENGINEER',
        modules: ['GENUAI_SKILL_TEST', 'CODING', 'DSA', 'PROJECT', 'INTERVIEW'],
        weights: { GENUAI_SKILL_TEST: 0.20, CODING: 0.30, DSA: 0.20, PROJECT: 0.15, INTERVIEW: 0.15 },
      },
      {
        company: 'Apple', title: 'Sales Executive',   canonical: 'SALES_EXECUTIVE',
        modules: ['GENUAI_SKILL_TEST', 'COMMUNICATION', 'GROUP_DISCUSSION', 'INTERVIEW'],
        weights: { GENUAI_SKILL_TEST: 0.30, COMMUNICATION: 0.30, GROUP_DISCUSSION: 0.20, INTERVIEW: 0.20 },
      },
      {
        company: 'Google', title: 'Software Engineer', canonical: 'SOFTWARE_ENGINEER',
        modules: ['GENUAI_SKILL_TEST', 'CODING', 'DSA', 'INTERVIEW'],
        weights: { GENUAI_SKILL_TEST: 0.25, CODING: 0.35, DSA: 0.25, INTERVIEW: 0.15 },
      },
      {
        company: 'Google', title: 'Data Analyst', canonical: 'DATA_ANALYST',
        modules: ['GENUAI_SKILL_TEST', 'APTITUDE', 'LOGICAL_REASONING', 'SQL_DATA_ANALYSIS', 'INTERVIEW'],
        weights: { GENUAI_SKILL_TEST: 0.20, APTITUDE: 0.20, LOGICAL_REASONING: 0.20, SQL_DATA_ANALYSIS: 0.25, INTERVIEW: 0.15 },
      },
    ];

    const companyRoleIdMap: Record<string, number> = {};
    const configVersionIdMap: Record<string, number> = {};

    const adminRes = await client.query(`SELECT id FROM users WHERE role = 'admin' LIMIT 1`);
    const adminId = adminRes.rows[0]?.id || 1;

    const agreementText = `I confirm that the selected assessment and skill requirements accurately represent the requirements of this role. I understand that GenuAI Works will use these requirements for dynamic assessment orchestration. I understand that candidate assessment paths may depend on these requirements. I understand that candidate grouping, evaluation, and company matching may depend on the assessment configuration. I understand that after confirmation the configuration will be locked. I understand that changing a locked configuration may require an applicable paid subscription/change plan. I understand that previous configuration versions will remain preserved.`;

    for (const cfg of companyRoleConfigs) {
      const companyUserId = companyUserIdMap[cfg.company];
      const canonicalRoleId = roleIdMap[cfg.canonical];

      const crRes = await client.query(
        `INSERT INTO company_roles (company_id, canonical_role_id, title, status)
         VALUES ($1, $2, $3, 'active')
         ON CONFLICT DO NOTHING
         RETURNING id`,
        [companyUserId, canonicalRoleId, cfg.title]
      );
      let companyRoleId: number;
      if (crRes.rows.length > 0) {
        companyRoleId = crRes.rows[0].id;
      } else {
        const existing = await client.query(
          `SELECT id FROM company_roles WHERE company_id = $1 AND title = $2`,
          [companyUserId, cfg.title]
        );
        companyRoleId = existing.rows[0].id;
      }
      companyRoleIdMap[`${cfg.company}_${cfg.title}`] = companyRoleId;

      const configRes = await client.query(
        `INSERT INTO company_assessment_configurations (company_id, company_role_id, status, created_by, locked_at)
         VALUES ($1, $2, 'locked', $3, NOW())
         ON CONFLICT (company_id, company_role_id) DO UPDATE SET status = 'locked', locked_at = NOW()
         RETURNING id`,
        [companyUserId, companyRoleId, adminId]
      );
      const configId = configRes.rows[0].id;

      const weightagesObj: Record<string, number> = {};
      for (const [modKey, w] of Object.entries(cfg.weights)) {
        weightagesObj[modKey] = w as number;
      }
      const selectedModuleIds = cfg.modules.map(m => moduleIdMap[m]).filter(Boolean);

      const versionRes = await client.query(
        `INSERT INTO company_configuration_versions
           (configuration_id, version_number, company_id, company_role_id, canonical_role_id,
            selected_module_ids, weightages, status, created_by)
         VALUES ($1, 1, $2, $3, $4, $5, $6, 'active', $7)
         ON CONFLICT DO NOTHING
         RETURNING id`,
        [configId, companyUserId, companyRoleId, canonicalRoleId,
         selectedModuleIds, JSON.stringify(weightagesObj), adminId]
      );
      let versionId: number;
      if (versionRes.rows.length > 0) {
        versionId = versionRes.rows[0].id;
      } else {
        const ev = await client.query(
          `SELECT id FROM company_configuration_versions WHERE configuration_id = $1 AND version_number = 1`,
          [configId]
        );
        versionId = ev.rows[0].id;
      }
      configVersionIdMap[`${cfg.company}_${cfg.title}`] = versionId;

      for (const modKey of cfg.modules) {
        const modId = moduleIdMap[modKey];
        if (!modId) continue;
        const w = (cfg.weights as any)[modKey] || 1.0;
        await client.query(
          `INSERT INTO company_configuration_requirements
             (configuration_version_id, assessment_module_id, weight, is_required)
           VALUES ($1, $2, $3, true)
           ON CONFLICT DO NOTHING`,
          [versionId, modId, w]
        );
      }

      await client.query(
        `INSERT INTO company_configuration_agreements
           (configuration_id, configuration_version_id, company_id, accepted_by, agreement_text, accepted_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT DO NOTHING`,
        [configId, versionId, companyUserId, adminId, agreementText]
      );
    }
    console.log('[Seed] Company roles + locked V1 configurations seeded:', Object.keys(companyRoleIdMap).length);

    // ─── 6. Role Equivalency Mappings (admin-confirmed) ───────────────────────
    const equivalencies = [
      { company: 'Zoho',   roleTitle: 'Software Developer', canonical: 'SOFTWARE_ENGINEER' },
      { company: 'Apple',  roleTitle: 'Software Engineer',  canonical: 'SOFTWARE_ENGINEER' },
      { company: 'Google', roleTitle: 'Software Engineer',  canonical: 'SOFTWARE_ENGINEER' },
      { company: 'Zoho',   roleTitle: 'Sales Executive',    canonical: 'SALES_EXECUTIVE'   },
      { company: 'Apple',  roleTitle: 'Sales Executive',    canonical: 'SALES_EXECUTIVE'   },
      { company: 'Google', roleTitle: 'Data Analyst',       canonical: 'DATA_ANALYST'      },
    ];

    for (const eq of equivalencies) {
      await client.query(
        `INSERT INTO role_equivalency_mapping
           (company_role_title, company_id, canonical_role_id, mapped_by, confidence, reviewed_by_admin)
         VALUES ($1, $2, $3, 'admin_confirmed', 1.0, $4)
         ON CONFLICT (company_id, company_role_title) DO UPDATE
           SET canonical_role_id = EXCLUDED.canonical_role_id, mapped_by = 'admin_confirmed'`,
        [eq.roleTitle, companyUserIdMap[eq.company], roleIdMap[eq.canonical], adminId]
      );
    }
    console.log('[Seed] Role equivalency mappings seeded:', equivalencies.length);

    // ─── 7. Subscription Plans ────────────────────────────────────────────────
    const plans = [
      {
        name: 'Starter Config Pack',
        description: 'Allows 1 assessment configuration change per active role. Best for small teams.',
        price: 2999, currency: 'INR', duration_days: 30,
        config_changes_allowed: 1, roles_allowed: 3, advanced_analytics: false,
        features: ['config_change_x1', 'email_support'],
      },
      {
        name: 'Growth Config Pack',
        description: 'Allows 3 configuration changes. Includes advanced analytics export.',
        price: 7999, currency: 'INR', duration_days: 60,
        config_changes_allowed: 3, roles_allowed: 10, advanced_analytics: true,
        features: ['config_change_x3', 'analytics_export', 'priority_support'],
      },
      {
        name: 'Enterprise Config Pack',
        description: 'Unlimited configuration changes with dedicated support and custom role limits.',
        price: 19999, currency: 'INR', duration_days: 365,
        config_changes_allowed: 999, roles_allowed: 999, advanced_analytics: true,
        features: ['config_change_unlimited', 'analytics_export', 'dedicated_support', 'custom_roles'],
      },
    ];

    for (const p of plans) {
      await client.query(
        `INSERT INTO subscription_plans
           (name, description, price, currency, duration_days, config_changes_allowed,
            roles_allowed, advanced_analytics, features, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
         ON CONFLICT DO NOTHING`,
        [p.name, p.description, p.price, p.currency, p.duration_days,
         p.config_changes_allowed, p.roles_allowed, p.advanced_analytics, JSON.stringify(p.features)]
      );
    }
    console.log('[Seed] Subscription plans seeded:', plans.length);

    await client.query('COMMIT');
    console.log('\n[Seed] GenuAI Works seed complete!');
    console.log('   Demo companies: Zoho, Apple, Google');
    console.log('   Logins: hr@zoho.demo.genuai / hr@apple.demo.genuai / hr@google.demo.genuai (password: demo123)');
    console.log('   Roles configured: 6 company-role combinations with locked V1 configs');
    console.log('   Role equivalency mappings: 6');
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('[Seed] Error:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);

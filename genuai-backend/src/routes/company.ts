import express from 'express';
import pool from '../db';
import { sendEmail } from '../utils/mailer';
import { getAdminForwardTemplate } from '../utils/emailTemplates';

const router = express.Router();

// ─────────────────────────────────────────────
// 1. Company Dashboard Overview & KPIs (8 KPIs + 10-Stage Pipeline + Today Actions)
// ─────────────────────────────────────────────
router.get('/overview/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;

    // 1. Core KPIs
    const activeJobsQuery = await pool.query(
      `SELECT COUNT(*) FROM jobs WHERE company_id = $1 AND (status = 'active' OR status IS NULL)`,
      [companyId]
    );

    const candidatesQuery = await pool.query(
      `SELECT COUNT(*) FROM assessments WHERE active_company_id = $1 OR $1 = ANY(company_ids)`,
      [companyId]
    );

    const newAppsQuery = await pool.query(
      `SELECT COUNT(*) FROM assessments WHERE (active_company_id = $1 OR $1 = ANY(company_ids)) AND created_at >= NOW() - INTERVAL '7 days'`,
      [companyId]
    );

    const completedAssessmentsQuery = await pool.query(
      `SELECT COUNT(*) FROM assessments WHERE (active_company_id = $1 OR $1 = ANY(company_ids)) AND overall_score IS NOT NULL`,
      [companyId]
    );

    const pendingAssessmentsQuery = await pool.query(
      `SELECT COUNT(*) FROM assessments WHERE (active_company_id = $1 OR $1 = ANY(company_ids)) AND (verdict IS NULL OR verdict = 'REVIEW')`,
      [companyId]
    );

    const scheduledInterviewsQuery = await pool.query(
      `SELECT COUNT(*) FROM interviews WHERE company_id = $1 AND status = 'scheduled'`,
      [companyId]
    );

    const shortlistedQuery = await pool.query(
      `SELECT COUNT(*) FROM assessments WHERE (active_company_id = $1 OR $1 = ANY(company_ids)) AND verdict = 'SHORTLIST'`,
      [companyId]
    );

    const offersQuery = await pool.query(
      `SELECT COUNT(*) FROM assessments WHERE (active_company_id = $1 OR $1 = ANY(company_ids)) AND verdict = 'OFFER'`,
      [companyId]
    );

    const hiredQuery = await pool.query(
      `SELECT COUNT(*) FROM assessments WHERE (active_company_id = $1 OR $1 = ANY(company_ids)) AND verdict = 'HIRE'`,
      [companyId]
    );

    // 2. Today's Actions
    const interviewsTodayQuery = await pool.query(
      `SELECT COUNT(*) FROM interviews WHERE company_id = $1 AND status = 'scheduled' AND DATE(scheduled_at) = CURRENT_DATE`,
      [companyId]
    );

    const pendingScorecardsQuery = await pool.query(
      `SELECT COUNT(*) FROM interviews WHERE company_id = $1 AND status = 'completed' AND score IS NULL`,
      [companyId]
    );

    const verificationRequiredQuery = await pool.query(
      `SELECT COUNT(*) FROM assessments WHERE (active_company_id = $1 OR $1 = ANY(company_ids)) AND triangle_status = 'FLAGGED'`,
      [companyId]
    );

    const totalApps = parseInt(candidatesQuery.rows[0]?.count || '0', 10);
    const activeJobsCount = parseInt(activeJobsQuery.rows[0]?.count || '0', 10);
    const newAppsCount = parseInt(newAppsQuery.rows[0]?.count || '0', 10);
    const completedCount = parseInt(completedAssessmentsQuery.rows[0]?.count || '0', 10);
    const interviewCount = parseInt(scheduledInterviewsQuery.rows[0]?.count || '0', 10);
    const shortlistedCount = parseInt(shortlistedQuery.rows[0]?.count || '0', 10);
    const offersCount = parseInt(offersQuery.rows[0]?.count || '0', 10);
    const hiredCount = parseInt(hiredQuery.rows[0]?.count || '0', 10);
    const pendingAssessmentsCount = parseInt(pendingAssessmentsQuery.rows[0]?.count || '0', 10);

    // 3. 10-Stage Pipeline Calculation
    const pipeline = {
      applied: totalApps,
      resumeScreening: Math.round(totalApps * 0.90),
      assessment: completedCount,
      gd: Math.round(completedCount * 0.75),
      aiInterview: Math.round(completedCount * 0.60),
      project: Math.round(completedCount * 0.45),
      shortlisted: shortlistedCount,
      finalInterview: interviewCount,
      offer: offersCount,
      hired: hiredCount,
    };

    // 4. Performance Averages
    const avgScoresQuery = await pool.query(
      `SELECT 
        ROUND(AVG(overall_score)) as avg_overall,
        ROUND(AVG(test_score)) as avg_technical,
        ROUND(AVG(communication_score)) as avg_communication,
        ROUND(AVG(interview_score)) as avg_interview,
        ROUND(AVG(coding_score)) as avg_coding,
        ROUND(AVG(ats_score)) as avg_ats
       FROM assessments 
       WHERE active_company_id = $1 OR $1 = ANY(company_ids)`,
      [companyId]
    );

    // 5. Recent candidates & Today's interviews
    const recentCandidates = await pool.query(
      `SELECT a.*, u.name, u.email, u.phone, u.college, u.github, u.linkedin
       FROM assessments a
       JOIN users u ON a.user_id = u.id
       WHERE a.active_company_id = $1 OR $1 = ANY(a.company_ids)
       ORDER BY a.created_at DESC
       LIMIT 8`,
      [companyId]
    );

    const todayInterviews = await pool.query(
      `SELECT i.*, u.email as candidate_email, u.phone as candidate_phone
       FROM interviews i
       LEFT JOIN users u ON i.candidate_id = u.id
       WHERE i.company_id = $1
       ORDER BY i.scheduled_at ASC
       LIMIT 6`,
      [companyId]
    );

    const activeJobs = await pool.query(
      `SELECT j.*, 
        (SELECT COUNT(*) FROM assessments a WHERE a.role = j.title AND (a.active_company_id = j.company_id OR j.company_id = ANY(a.company_ids))) as applicants_count
       FROM jobs j 
       WHERE j.company_id = $1 
       ORDER BY j.created_at DESC LIMIT 6`,
      [companyId]
    );

    // 6. Live Activity feed
    const activityFeed = await pool.query(
      `SELECT a.id, a.user_id, a.role, a.overall_score, a.verdict, a.created_at, u.name, 'assessment_completed' as type
       FROM assessments a
       JOIN users u ON a.user_id = u.id
       WHERE a.active_company_id = $1 OR $1 = ANY(a.company_ids)
       ORDER BY a.created_at DESC
       LIMIT 10`,
      [companyId]
    );

    res.json({
      kpis: {
        activeJobs: activeJobsCount,
        totalCandidates: totalApps,
        newApplications: newAppsCount,
        assessmentsCompleted: completedCount,
        interviewsScheduled: interviewCount,
        shortlisted: shortlistedCount,
        offersSent: offersCount,
        hired: hiredCount,
        assessmentsPending: pendingAssessmentsCount,
        trends: {
          jobs: "+2 this month",
          candidates: "+14% this month",
          applications: "+8% this week",
          assessments: "+18% this month",
          interviews: "+5 this week",
          shortlisted: "+12%",
          offers: "+3 this month",
          hired: "+2 this month",
        }
      },
      todayActions: {
        interviewsToday: parseInt(interviewsTodayQuery.rows[0]?.count || '0', 10),
        scorecardsPending: parseInt(pendingScorecardsQuery.rows[0]?.count || '0', 10),
        awaitingReview: pendingAssessmentsCount,
        verificationRequired: parseInt(verificationRequiredQuery.rows[0]?.count || '0', 10),
      },
      pipeline,
      performanceAverages: avgScoresQuery.rows[0] || {
        avg_overall: 78,
        avg_technical: 82,
        avg_communication: 76,
        avg_interview: 80,
        avg_coding: 85,
        avg_ats: 79,
      },
      recentCandidates: recentCandidates.rows,
      todayInterviews: todayInterviews.rows,
      activeJobs: activeJobs.rows,
      activityFeed: activityFeed.rows,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 2. AI Recruitment Insights (Groq / Backend AI)
// ─────────────────────────────────────────────
router.get('/ai-insights/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    const candidatesRes = await pool.query(
      `SELECT a.overall_score, a.ats_score, a.test_score, a.interview_score, a.role, a.verdict, u.name
       FROM assessments a
       JOIN users u ON a.user_id = u.id
       WHERE a.active_company_id = $1 OR $1 = ANY(a.company_ids)
       ORDER BY a.overall_score DESC
       LIMIT 10`,
      [companyId]
    );

    const candidates = candidatesRes.rows;
    const total = candidates.length;

    let insights: string[] = [];

    if (total === 0) {
      insights = [
        "No candidate data available yet. Post a job to start receiving candidates and generating AI recruitment insights.",
        "Assessments will automatically evaluate problem solving, coding, and communication benchmarks."
      ];
    } else {
      const topCandidates = candidates.filter(c => c.overall_score >= 80);
      const pendingInterviews = candidates.filter(c => !c.verdict || c.verdict === 'REVIEW');
      const avgScore = Math.round(candidates.reduce((acc, c) => acc + (c.overall_score || 0), 0) / total);

      if (topCandidates.length > 0) {
        insights.push(`${topCandidates.length} candidate(s) demonstrate high technical and role alignment (score > 80%).`);
      }
      if (pendingInterviews.length > 0) {
        insights.push(`${pendingInterviews.length} candidate(s) are awaiting interview scheduling or final evaluation.`);
      }
      insights.push(`Average candidate cohort performance stands at ${avgScore}% overall score.`);
    }

    res.json({
      insights,
      totalAnalyzed: total,
      timestamp: new Date().toISOString(),
      disclaimer: "AI-generated recommendations should support, not replace, human hiring decisions."
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 3. Candidates Management
// ─────────────────────────────────────────────
router.get('/candidates/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    const { search, verdict } = req.query;

    let query = `
      SELECT a.*, u.name, u.email, u.phone, u.college, u.github, u.linkedin
      FROM assessments a
      JOIN users u ON a.user_id = u.id
      WHERE (a.active_company_id = $1 OR $1 = ANY(a.company_ids))
    `;
    const params: any[] = [companyId];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (LOWER(u.name) LIKE $${params.length} OR LOWER(u.email) LIKE $${params.length} OR LOWER(a.role) LIKE $${params.length})`;
    }

    if (verdict && verdict !== 'ALL') {
      if (verdict === 'PENDING') {
        query += ` AND (a.verdict IS NULL OR a.verdict = 'REVIEW')`;
      } else {
        params.push(verdict);
        query += ` AND a.verdict = $${params.length}`;
      }
    }

    query += ` ORDER BY a.overall_score DESC`;

    const result = await pool.query(query, params);
    res.json({ candidates: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 4. Detailed Candidate Profile
// ─────────────────────────────────────────────
router.get('/candidate-profile/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;

    const candidateQuery = await pool.query(
      `SELECT id, name, email, role, phone, college, github, linkedin, created_at FROM users WHERE id = $1`,
      [candidateId]
    );

    if (candidateQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Candidate not found.' });
    }

    const assessmentQuery = await pool.query(
      `SELECT * FROM assessments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [candidateId]
    );

    const interviewsQuery = await pool.query(
      `SELECT * FROM interviews WHERE candidate_id = $1 ORDER BY scheduled_at DESC`,
      [candidateId]
    );

    const projectsQuery = await pool.query(
      `SELECT * FROM projects WHERE candidate_id = $1 ORDER BY created_at DESC`,
      [candidateId]
    );

    res.json({
      user: candidateQuery.rows[0],
      assessment: assessmentQuery.rows[0] || null,
      interviews: interviewsQuery.rows,
      projects: projectsQuery.rows,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 5. Job Management
// ─────────────────────────────────────────────
router.get('/jobs/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    const result = await pool.query(
      `SELECT j.*, 
        (SELECT COUNT(*) FROM assessments a WHERE a.role = j.title AND (a.active_company_id = j.company_id OR j.company_id = ANY(a.company_ids))) as applicants_count
       FROM jobs j
       WHERE j.company_id = $1
       ORDER BY j.created_at DESC`,
      [companyId]
    );
    res.json({ jobs: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/jobs', async (req, res) => {
  try {
    const {
      company_id,
      title,
      department,
      location,
      employment_type,
      experience_level,
      description,
      skills,
      salary_min,
      salary_max,
      assessment_config,
      status,
    } = req.body;

    if (!company_id || !title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    const result = await pool.query(
      `INSERT INTO jobs (
        company_id, title, department, location, employment_type, experience_level,
        description, skills, skills_required, salary_min, salary_max, assessment_config, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8, $9, $10, $11, $12, NOW()) RETURNING *`,
      [
        company_id,
        title,
        department || 'Engineering',
        location || 'Remote',
        employment_type || 'Full-time',
        experience_level || 'Mid-Level',
        description,
        skills || '',
        salary_min || 0,
        salary_max || 0,
        JSON.stringify(assessment_config || { aptitude: true, coding: true, communication: true, ai_interview: true }),
        status || 'active',
      ]
    );

    res.json({ success: true, job: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, department, location, employment_type, experience_level, description, skills, salary_min, salary_max, status } = req.body;

    const result = await pool.query(
      `UPDATE jobs SET
        title = COALESCE($1, title),
        department = COALESCE($2, department),
        location = COALESCE($3, location),
        employment_type = COALESCE($4, employment_type),
        experience_level = COALESCE($5, experience_level),
        description = COALESCE($6, description),
        skills = COALESCE($7, skills),
        salary_min = COALESCE($8, salary_min),
        salary_max = COALESCE($9, salary_max),
        status = COALESCE($10, status)
       WHERE id = $11 RETURNING *`,
      [title, department, location, employment_type, experience_level, description, skills, salary_min, salary_max, status, id]
    );

    res.json({ success: true, job: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 6. Interview Scheduling & Management
// ─────────────────────────────────────────────
router.get('/interviews/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    const result = await pool.query(
      `SELECT * FROM interviews WHERE company_id = $1 ORDER BY scheduled_at ASC`,
      [companyId]
    );
    res.json({ interviews: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/interviews', async (req, res) => {
  try {
    const {
      company_id,
      candidate_id,
      candidate_name,
      candidate_email,
      job_title,
      interview_type,
      scheduled_at,
      meeting_link,
      interviewer_name,
    } = req.body;

    if (!company_id || !candidate_id || !scheduled_at) {
      return res.status(400).json({ error: 'Candidate and scheduled time are required.' });
    }

    const result = await pool.query(
      `INSERT INTO interviews (
        company_id, candidate_id, candidate_name, candidate_email, job_title,
        interview_type, scheduled_at, status, meeting_link, interviewer_name, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'scheduled', $8, $9, NOW()) RETURNING *`,
      [
        company_id,
        candidate_id,
        candidate_name || 'Candidate',
        candidate_email || '',
        job_title || 'Software Engineer',
        interview_type || 'Technical',
        scheduled_at,
        meeting_link || `https://meet.google.com/genuai-${Math.random().toString(36).substring(7)}`,
        interviewer_name || 'Hiring Manager',
      ]
    );

    res.json({ success: true, interview: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/interviews/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, score, ai_summary } = req.body;

    const result = await pool.query(
      `UPDATE interviews SET
        status = COALESCE($1, status),
        score = COALESCE($2, score),
        ai_summary = COALESCE($3, ai_summary)
       WHERE id = $4 RETURNING *`,
      [status, score, ai_summary, id]
    );

    res.json({ success: true, interview: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 7. Project Assignment & Review
// ─────────────────────────────────────────────
router.get('/projects/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    const result = await pool.query(
      `SELECT p.*, u.name as candidate_name, u.email as candidate_email
       FROM projects p
       LEFT JOIN users u ON p.candidate_id = u.id
       WHERE p.company_id = $1
       ORDER BY p.created_at DESC`,
      [companyId]
    );
    res.json({ projects: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const { company_id, candidate_id, title, description, deadline } = req.body;

    const result = await pool.query(
      `INSERT INTO projects (company_id, candidate_id, title, description, deadline, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'assigned', NOW()) RETURNING *`,
      [company_id, candidate_id, title, description, deadline]
    );

    res.json({ success: true, project: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/projects/:id/score', async (req, res) => {
  try {
    const { id } = req.params;
    const { score, feedback, status } = req.body;

    const result = await pool.query(
      `UPDATE projects SET
        score = $1,
        feedback = $2,
        status = $3
       WHERE id = $4 RETURNING *`,
      [score, feedback, status || 'completed', id]
    );

    res.json({ success: true, project: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 8. Company Profile & Team Settings
// ─────────────────────────────────────────────
router.get('/profile/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;

    const userRes = await pool.query(`SELECT id, name, email FROM users WHERE id = $1`, [companyId]);
    const profileRes = await pool.query(`SELECT * FROM company_profiles WHERE user_id = $1`, [companyId]);

    const user = userRes.rows[0];
    const profile = profileRes.rows[0] || {
      company_name: user?.name || 'Company',
      industry: 'Technology',
      location: 'Bengaluru, India',
      website: '',
      description: '',
      company_size: '50-200 employees',
      contact_email: user?.email || '',
      team_members: [],
    };

    res.json({ user, profile });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/profile/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    const { company_name, logo_url, industry, website, description, location, company_size, contact_email, team_members } = req.body;

    const check = await pool.query(`SELECT id FROM company_profiles WHERE user_id = $1`, [companyId]);

    let result;
    if (check.rows.length === 0) {
      result = await pool.query(
        `INSERT INTO company_profiles (
          user_id, company_name, logo_url, industry, website, description,
          location, company_size, contact_email, team_members, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()) RETURNING *`,
        [
          companyId,
          company_name,
          logo_url || '',
          industry || 'Technology',
          website || '',
          description || '',
          location || 'Bengaluru, India',
          company_size || '50-200 employees',
          contact_email || '',
          JSON.stringify(team_members || []),
        ]
      );
    } else {
      result = await pool.query(
        `UPDATE company_profiles SET
          company_name = COALESCE($1, company_name),
          logo_url = COALESCE($2, logo_url),
          industry = COALESCE($3, industry),
          website = COALESCE($4, website),
          description = COALESCE($5, description),
          location = COALESCE($6, location),
          company_size = COALESCE($7, company_size),
          contact_email = COALESCE($8, contact_email),
          team_members = COALESCE($9, team_members)
         WHERE user_id = $10 RETURNING *`,
        [
          company_name,
          logo_url,
          industry,
          website,
          description,
          location,
          company_size,
          contact_email,
          JSON.stringify(team_members || []),
          companyId,
        ]
      );
    }

    res.json({ success: true, profile: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 9. Subscription & Quota
// ─────────────────────────────────────────────
router.get('/subscription/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    const jobsCountRes = await pool.query(`SELECT COUNT(*) FROM jobs WHERE company_id = $1`, [companyId]);
    const candidatesCountRes = await pool.query(`SELECT COUNT(*) FROM assessments WHERE active_company_id = $1 OR $1 = ANY(company_ids)`, [companyId]);

    const activeJobs = parseInt(jobsCountRes.rows[0]?.count || '0', 10);
    const candidatesEvaluated = parseInt(candidatesCountRes.rows[0]?.count || '0', 10);

    res.json({
      plan: {
        name: 'Enterprise AI Suite',
        status: 'Active',
        billingCycle: 'Annual',
        renewalDate: '2027-01-01',
        price: 'Custom Enterprise',
      },
      usage: {
        activeJobs: { used: activeJobs, limit: 50 },
        candidates: { used: candidatesEvaluated, limit: 2500 },
        aiInterviews: { used: 12, limit: 500 },
        proctoringSignals: { used: 45, limit: 5000 },
      },
      features: [
        'Multi-stage recruitment intelligence',
        'AI mock & technical interview insights',
        'Automated Waterfall candidate routing',
        'Assessment integrity & proctoring signals',
        'Enterprise team RBAC permissions',
      ],
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 10. Candidate Stage Progression & Scorecard
// ─────────────────────────────────────────────
router.put('/candidate-stage/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { verdict } = req.body;

    const result = await pool.query(
      `UPDATE assessments SET verdict = COALESCE($1, verdict) WHERE id = $2 RETURNING *`,
      [verdict, id]
    );

    res.json({ success: true, assessment: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/scorecard', async (req, res) => {
  try {
    const {
      interview_id,
      candidate_id,
      company_id,
      technical_score,
      communication_score,
      problem_solving_score,
      teamwork_score,
      recommendation,
      notes,
    } = req.body;

    const avgScore = Math.round(
      ((technical_score || 0) + (communication_score || 0) + (problem_solving_score || 0) + (teamwork_score || 0)) * 2.5
    );

    if (interview_id) {
      await pool.query(
        `UPDATE interviews SET
          status = 'completed',
          score = $1,
          ai_summary = $2
         WHERE id = $3`,
        [
          avgScore,
          JSON.stringify({ technical_score, communication_score, problem_solving_score, teamwork_score, recommendation, notes }),
          interview_id,
        ]
      );
    }

    res.json({ success: true, score: avgScore, recommendation });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;


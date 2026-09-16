import express from 'express';
import pool from '../db';

const router = express.Router();

// ─────────────────────────────────────────────
// 1. Candidate Dashboard Overview & Telemetry
// ─────────────────────────────────────────────
router.get('/overview/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Candidate user record
    const userRes = await pool.query(
      `SELECT id, name, email, role, phone, college, github, linkedin, status, created_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'Candidate profile not found.' });
    }

    const candidate = userRes.rows[0];

    // 2. Candidate assessment history & multi-module progress
    const assessmentRes = await pool.query(
      `SELECT a.*, u.name as company_name
       FROM assessments a
       LEFT JOIN users u ON a.active_company_id = u.id
       WHERE a.user_id = $1
       ORDER BY a.created_at DESC`,
      [userId]
    );

    const assessments = assessmentRes.rows;
    const latestAssessment = assessments[0] || null;

    // 3. Profile completion calculation
    const missingFields: string[] = [];
    let completionScore = 0;

    if (candidate.name) completionScore += 20;
    else missingFields.push('Full Name');

    if (candidate.email) completionScore += 20;
    else missingFields.push('Email Address');

    if (candidate.phone) completionScore += 15;
    else missingFields.push('Phone Number');

    if (candidate.college) completionScore += 15;
    else missingFields.push('College / University');

    if (candidate.github || candidate.linkedin) completionScore += 15;
    else missingFields.push('GitHub / LinkedIn');

    if (latestAssessment?.skills || latestAssessment?.resume_url) completionScore += 15;
    else missingFields.push('Resume / Skills');

    // 4. Candidate scheduled interviews
    const interviewRes = await pool.query(
      `SELECT i.*, u.name as company_name
       FROM interviews i
       LEFT JOIN users u ON i.company_id = u.id
       WHERE i.candidate_id = $1
       ORDER BY i.scheduled_at DESC`,
      [userId]
    );

    // 5. Recommended active jobs
    const jobsRes = await pool.query(
      `SELECT j.*, u.name as company_name
       FROM jobs j
       LEFT JOIN users u ON j.company_id = u.id
       WHERE j.status = 'active' OR j.status IS NULL
       ORDER BY j.created_at DESC
       LIMIT 5`
    );

    // 6. Platform notifications
    const notifRes = await pool.query(
      `SELECT * FROM system_notifications
       WHERE audience = 'all' OR audience = 'candidate'
       ORDER BY created_at DESC
       LIMIT 5`
    );

    // 7. Career Targets Summary (Phase 2 minimal count)
    const targetCountRes = await pool.query(
      `SELECT COUNT(*) as total_targets,
              COUNT(CASE WHEN (COALESCE(cp.verification_status, 'UNVERIFIED') = 'VERIFIED') AND COALESCE(cr.workflow_status, 'DRAFT') = 'ACTIVE' THEN 1 END) as live_targets
       FROM candidate_role_interests cri
       LEFT JOIN users u ON cri.company_id = u.id
       LEFT JOIN company_profiles cp ON u.id = cp.user_id
       LEFT JOIN company_roles cr ON cri.company_role_id = cr.id
       WHERE cri.candidate_id = $1 AND (cri.status IS NULL OR cri.status = 'active')`,
      [userId]
    ).catch(() => ({ rows: [{ total_targets: 0, live_targets: 0 }] }));

    const careerTargetsSummary = {
      total: parseInt(targetCountRes.rows[0]?.total_targets || '0', 10),
      live: parseInt(targetCountRes.rows[0]?.live_targets || '0', 10),
    };

    // 8. Dynamic AI Insight
    let aiInsight = "AI career insights will appear as you build your GenuAI profile and activity.";
    if (completionScore < 100) {
      aiInsight = `Complete your profile by adding your ${missingFields.slice(0, 2).join(' and ')} to maximize recruiter visibility.`;
    } else if (assessments.length === 0) {
      aiInsight = "Start your verified assessment to prove your skills and receive job matches across partner employers.";
    } else if (latestAssessment && !latestAssessment.overall_score) {
      aiInsight = "Continue your in-progress evaluation modules to complete your GenuAI verified scorecard.";
    } else if (interviewRes.rows.some(i => i.status === 'scheduled')) {
      const nextIv = interviewRes.rows.find(i => i.status === 'scheduled');
      aiInsight = `You have an upcoming interview round for ${nextIv.job_title || 'Software Engineer'}. Prepare your key project talking points.`;
    } else if (latestAssessment?.overall_score >= 80) {
      aiInsight = "Outstanding performance on your verified scorecard! Explore matching job openings in the Search Hub.";
    }

    res.json({
      candidate,
      profileCompletion: {
        percentage: Math.min(100, completionScore),
        isComplete: completionScore >= 100,
        missing: missingFields,
      },
      latestAssessment,
      applications: assessments,
      interviews: interviewRes.rows,
      recommendedJobs: jobsRes.rows,
      notifications: notifRes.rows,
      careerTargetsSummary,
      aiInsight,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 2. Candidate Update Profile
// ─────────────────────────────────────────────
router.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, college, github, linkedin } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           college = COALESCE($3, college),
           github = COALESCE($4, github),
           linkedin = COALESCE($5, linkedin)
       WHERE id = $6
       RETURNING id, name, email, phone, college, github, linkedin, role, status`,
      [name, phone, college, github, linkedin, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 3. GET /candidate/:id/company-matches — Real candidate company match scores
// ─────────────────────────────────────────────
router.get('/:userId/company-matches', async (req, res) => {
  try {
    const { userId } = req.params;

    const matchesRes = await pool.query(
      `SELECT ccm.id, ccm.candidate_id, ccm.company_id, ccm.configuration_version_id,
              ccm.match_score, ccm.score_components, ccm.strengths, ccm.weak_areas,
              ccm.explanation, ccm.created_at,
              COALESCE(cp.company_name, u.name, 'Company #' || ccm.company_id) as company_name,
              cr.title as role_title,
              ccv.version_number, ccv.created_at as version_locked_at,
              cag.id as group_id, cag.assessment_pattern_hash, cag.pattern_description
       FROM candidate_company_matches ccm
       LEFT JOIN company_profiles cp ON ccm.company_id = cp.user_id
       LEFT JOIN users u ON ccm.company_id = u.id
       LEFT JOIN company_configuration_versions ccv ON ccm.configuration_version_id = ccv.id
       LEFT JOIN company_roles cr ON ccv.company_role_id = cr.id
       LEFT JOIN candidate_group_memberships cgm ON ccm.candidate_id = cgm.candidate_id
       LEFT JOIN candidate_assessment_groups cag ON cgm.group_id = cag.id
       WHERE ccm.candidate_id = $1
       ORDER BY ccm.created_at DESC`,
      [userId]
    );

    res.json({ matches: matchesRes.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 4. GET /candidate/match/groups/:candidateId or /match/groups/:candidateId
// ─────────────────────────────────────────────
router.get('/match/groups/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;

    const groupsRes = await pool.query(
      `SELECT cgm.id as membership_id, cgm.candidate_id, cgm.group_id, cgm.dynamic_path_id, cgm.created_at,
              cag.canonical_role_id, cag.configuration_version_id, cag.assessment_pattern_hash, cag.pattern_description,
              rt.canonical_name as canonical_role_name
       FROM candidate_group_memberships cgm
       JOIN candidate_assessment_groups cag ON cgm.group_id = cag.id
       LEFT JOIN role_taxonomy rt ON cag.canonical_role_id = rt.id
       WHERE cgm.candidate_id = $1
       ORDER BY cgm.created_at DESC`,
      [candidateId]
    );

    res.json({ groups: groupsRes.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

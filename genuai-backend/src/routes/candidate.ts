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

    // 7. Dynamic AI Insight
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

export default router;

import express from 'express';
import pool from '../db';

const router = express.Router();

// Auto-migrate: ensure company_ids column exists on assessments table
(async () => {
  try {
    await pool.query(`
      ALTER TABLE assessments 
      ADD COLUMN IF NOT EXISTS company_ids INTEGER[] DEFAULT '{}'
    `);
    console.log('✅ assessments.company_ids column ready');
  } catch (err: any) {
    console.warn('Migration warning (company_ids):', err.message);
  }
})();

/**
 * Confirms the caller is allowed to see/act on a given assessment:
 * the candidate who owns it, a company it's associated with, or an admin.
 */
async function assessmentBelongsToCaller(assessmentId: string, userId: number, role: string): Promise<boolean> {
  const r = await pool.query(
    'SELECT user_id, active_company_id, company_ids FROM assessments WHERE id = $1',
    [assessmentId]
  );
  if (r.rows.length === 0) return false;
  const row = r.rows[0];
  if (role === 'admin') return true;
  if (Number(row.user_id) === userId) return true;
  if (role === 'company') {
    if (Number(row.active_company_id) === userId) return true;
    if ((row.company_ids || []).map(Number).includes(userId)) return true;
  }
  return false;
}

// Submit assessment (now includes company_ids)
router.post('/submit', async (req, res) => {
  try {
    const {
      user_id, job_id, resume_text, resume_url, skills,
      ats_score, resume_score, interview_score, test_score,
      consistency_score, overall_score, authenticity_score,
      verdict, triangle_status, salary_min, salary_max,
      improvement_plan, company_ids
    } = req.body;

    // A candidate may only submit a result under their own account.
    // (Note: this only stops impersonation — it does NOT yet stop a
    // candidate from sending fabricated scores for themselves. That
    // requires server-side scoring and is tracked separately.)
    if (req.user?.role !== 'admin' && Number(user_id) !== req.user?.id) {
      return res.status(403).json({ error: 'You can only submit an assessment for your own account.' });
    }

    const activeCompanyId = company_ids && company_ids.length > 0 ? company_ids[0] : null;

    const result = await pool.query(
      `INSERT INTO assessments (
        user_id, job_id, resume_text, resume_url, skills,
        ats_score, resume_score, interview_score, test_score,
        consistency_score, overall_score, authenticity_score,
        verdict, triangle_status, salary_min, salary_max,
        improvement_plan, company_ids, active_company_id
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19
      ) RETURNING *`,
      [
        user_id, job_id, resume_text, resume_url, skills,
        ats_score, resume_score, interview_score, test_score,
        consistency_score, overall_score, authenticity_score,
        verdict, triangle_status, salary_min, salary_max,
        improvement_plan,
        company_ids && company_ids.length > 0 ? company_ids : [],
        activeCompanyId
      ]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get single assessment
router.get('/:id', async (req, res) => {
  try {
    const allowed = await assessmentBelongsToCaller(req.params.id, req.user!.id, req.user!.role);
    if (!allowed) {
      return res.status(403).json({ error: 'You do not have permission to view this assessment.' });
    }

    const result = await pool.query(
      'SELECT * FROM assessments WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Assessment not found.' });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Log cheat event
router.post('/cheat', async (req, res) => {
  try {
    const { assessment_id, event_type, penalty_applied } = req.body;

    const allowed = await assessmentBelongsToCaller(assessment_id, req.user!.id, req.user!.role);
    if (!allowed) {
      return res.status(403).json({ error: 'You do not have permission to log events for this assessment.' });
    }

    await pool.query(
      'INSERT INTO cheat_logs (assessment_id, event_type, penalty_applied) VALUES ($1, $2, $3)',
      [assessment_id, event_type, penalty_applied]
    );
    res.json({ logged: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

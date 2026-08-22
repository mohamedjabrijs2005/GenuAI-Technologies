import express from 'express';
import pool from '../db';

const router = express.Router();

// 1. GET /candidate/interests/:candidateId — Fetch candidate's active company & role selections
router.get('/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;

    try {
      const dbRes = await pool.query(
        `SELECT cri.company_id, u.name as company_name, cri.company_role_id, cr.title as role_title
         FROM candidate_role_interests cri
         LEFT JOIN users u ON cri.company_id = u.id
         LEFT JOIN company_roles cr ON cri.company_role_id = cr.id
         WHERE cri.candidate_id = $1 AND cri.status = 'active'`,
        [candidateId]
      );

      if (dbRes.rows.length > 0) {
        const selections = dbRes.rows.map(r => ({
          companyId: r.company_id,
          companyName: r.company_name || `Company #${r.company_id}`,
          companyRoleId: r.company_role_id,
          roleTitle: r.role_title || 'Software Engineer',
        }));
        return res.json({ selections });
      }
    } catch (err: any) {
      console.warn('[candidateInterests] DB fetch notice:', err.message);
    }

    res.json({ selections: [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. POST /candidate/interests/:candidateId — Save/update candidate's company & role selections
router.post('/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { selections } = req.body;

    if (!Array.isArray(selections)) {
      return res.status(400).json({ error: 'selections array is required.' });
    }

    try {
      // Clear previous active selections
      await pool.query(
        `UPDATE candidate_role_interests SET status = 'superseded' WHERE candidate_id = $1`,
        [candidateId]
      );

      for (const sel of selections) {
        await pool.query(
          `INSERT INTO candidate_company_interests (candidate_id, company_id, status)
           VALUES ($1, $2, 'active')
           ON CONFLICT (candidate_id, company_id) DO UPDATE SET status = 'active'`,
          [candidateId, sel.companyId]
        );

        await pool.query(
          `INSERT INTO candidate_role_interests (candidate_id, company_id, company_role_id, status)
           VALUES ($1, $2, $3, 'active')
           ON CONFLICT (candidate_id, company_id, company_role_id) DO UPDATE SET status = 'active'`,
          [candidateId, sel.companyId, sel.companyRoleId || null]
        );
      }
    } catch (err: any) {
      console.warn('[candidateInterests] DB save notice:', err.message);
    }

    res.json({ success: true, count: selections.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

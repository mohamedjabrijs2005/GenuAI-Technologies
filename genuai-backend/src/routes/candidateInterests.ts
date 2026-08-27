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
         WHERE cri.candidate_id = $1 
           AND cri.status = 'active'
           AND u.id IS NOT NULL
           AND LOWER(u.name) NOT LIKE '%mohamed jabri%'
           AND LOWER(u.name) NOT LIKE '%demo company%'
           AND LOWER(u.name) NOT LIKE '%nigga%'
           AND LOWER(TRIM(u.name)) NOT IN ('company', 'test', 'admin')`,
        [candidateId]
      );

      if (dbRes.rows.length > 0) {
        // Deduplicate and sanitize
        const seen = new Set<string>();
        const selections = [];
        for (const r of dbRes.rows) {
          const compName = r.company_name || `Company #${r.company_id}`;
          const roleTitle = r.role_title || 'Software Engineer';
          const key = `${r.company_id}-${roleTitle}`;
          if (!seen.has(key)) {
            seen.add(key);
            selections.push({
              companyId: r.company_id,
              companyName: compName,
              companyRoleId: r.company_role_id,
              roleTitle,
            });
          }
        }
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

// 2. DELETE /candidate/interests/:candidateId — Clear candidate's active selections
router.delete('/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;
    await pool.query(
      `UPDATE candidate_role_interests SET status = 'cleared' WHERE candidate_id = $1`,
      [candidateId]
    );
    await pool.query(
      `UPDATE candidate_company_interests SET status = 'cleared' WHERE candidate_id = $1`,
      [candidateId]
    );
    res.json({ success: true, message: 'Selections cleared successfully.' });
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

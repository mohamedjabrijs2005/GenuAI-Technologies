import express from 'express';
import pool from '../db';

const router = express.Router();

// 1. GET /roles/taxonomy — List all canonical roles
router.get('/taxonomy', async (_req, res) => {
  try {
    const dbRes = await pool.query(
      `SELECT id, canonical_name, category, description, status, created_at
       FROM role_taxonomy
       WHERE status = 'active'
       ORDER BY canonical_name ASC`
    );

    res.json({ taxonomy: dbRes.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET /roles/equivalency — List role equivalency mappings for admin review
router.get('/equivalency', async (_req, res) => {
  try {
    const dbRes = await pool.query(
      `SELECT rem.id, rem.company_role_title, rem.mapped_by, rem.confidence, rem.created_at,
              u.name as company_name, rt.canonical_name as canonical_role
       FROM role_equivalency_mapping rem
       LEFT JOIN users u ON rem.company_id = u.id
       LEFT JOIN role_taxonomy rt ON rem.canonical_role_id = rt.id
       ORDER BY rem.mapped_by ASC, rem.created_at DESC`
    );

    res.json({ mappings: dbRes.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. PUT /roles/equivalency/:id/confirm — Admin confirms AI-suggested role mapping (Fix 1 & Fix 5)
router.put('/equivalency/:id/confirm', async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId, canonicalRoleId } = req.body;

    const dbRes = await pool.query(
      `UPDATE role_equivalency_mapping
       SET mapped_by = 'admin_confirmed',
           reviewed_by_admin = $1,
           canonical_role_id = COALESCE($2, canonical_role_id)
       WHERE id = $3
       RETURNING *`,
      [adminId || 1, canonicalRoleId || null, id]
    );

    res.json({ success: true, mapping: dbRes.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

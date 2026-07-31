import express from 'express';
import pool from '../db';

const router = express.Router();

router.get('/status', async (req, res) => {
  try {
    const user_id = req.user ? (req.user as any).id : null;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

    let result = await pool.query('SELECT * FROM pm_applications WHERE user_id = $1', [user_id]);
    
    // Auto-create an application for the user if it doesn't exist to simulate the UI
    if (result.rows.length === 0) {
      result = await pool.query(
        'INSERT INTO pm_applications (user_id, status) VALUES ($1, $2) RETURNING *',
        [user_id, 'submitted']
      );
    }
    
    res.json({ application: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

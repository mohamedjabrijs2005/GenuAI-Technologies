import express from 'express';
import pool from '../db';

const router = express.Router();

router.get('/latest', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM news ORDER BY created_at DESC LIMIT 10');
    res.json({ news: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

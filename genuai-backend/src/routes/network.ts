import express from 'express';
import pool from '../db';

const router = express.Router();

router.get('/posts', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name as user_name FROM network_posts p
       LEFT JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC LIMIT 20`
    );
    res.json({ posts: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/posts', async (req, res) => {
  try {
    const { content } = req.body;
    const user_id = req.user ? (req.user as any).id : 1; // Fallback to 1 if no user (for testing)

    if (!content) return res.status(400).json({ error: 'Content is required' });

    const result = await pool.query(
      'INSERT INTO network_posts (user_id, content) VALUES ($1, $2) RETURNING *',
      [user_id, content]
    );

    res.json({ success: true, post: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

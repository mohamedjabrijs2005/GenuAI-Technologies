import express from 'express';
import pool from '../db';
import { SubscriptionService } from '../services/subscriptionService';

const router = express.Router();

// 1. GET /subscriptions/plans — List active subscription plans
router.get('/plans', async (_req, res) => {
  try {
    const plans = await SubscriptionService.getActivePlans();
    res.json({ plans });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. POST /subscriptions/purchase — Purchase subscription plan (Mock Razorpay flow)
router.post('/purchase', async (req, res) => {
  try {
    const { companyId, planId, paymentMethod } = req.body;

    const plans = await SubscriptionService.getActivePlans();
    const targetPlan = plans.find((p) => p.id === Number(planId)) || plans[0];

    // Create payment record
    const payRes = await pool.query(
      `INSERT INTO payments (company_id, amount, currency, gateway, status, paid_at)
       VALUES ($1, $2, $3, $4, 'completed', NOW())
       RETURNING id`,
      [companyId || 1, targetPlan.price, targetPlan.currency, paymentMethod || 'mock_razorpay']
    );

    // Create company subscription record
    const subRes = await pool.query(
      `INSERT INTO company_subscriptions
         (company_id, plan_id, status, starts_at, expires_at, payment_id)
       VALUES ($1, $2, 'active', NOW(), NOW() + ($3 || ' days')::interval, $4)
       RETURNING id, status, expires_at`,
      [companyId || 1, targetPlan.id, targetPlan.durationDays, payRes.rows[0].id]
    );

    res.json({ success: true, subscription: subRes.rows[0], plan: targetPlan });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST /subscriptions/change-requests/:requestId/approve — Admin approves change request & creates V2 (Rules §13, §15, Fix 2)
router.post('/change-requests/:requestId/approve', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { adminId, selectedModuleIds } = req.body;

    const reqRes = await pool.query(
      `SELECT company_id, configuration_id FROM configuration_change_requests WHERE id = $1 LIMIT 1`,
      [requestId]
    );

    if (reqRes.rows.length === 0) {
      return res.status(404).json({ error: 'Change request not found.' });
    }

    const { company_id, configuration_id } = reqRes.rows[0];

    const result = await SubscriptionService.approveConfigurationChange(
      company_id,
      configuration_id,
      selectedModuleIds || [1, 2, 3, 4, 7],
      adminId || 1
    );

    // Update request status
    await pool.query(
      `UPDATE configuration_change_requests SET status = 'approved', approved_at = NOW(), approved_by = $1 WHERE id = $2`,
      [adminId || 1, requestId]
    );

    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

import express from 'express';
import pool from '../db';
import { SubscriptionService } from '../services/subscriptionService';

const router = express.Router();

// 1. GET /company-roles/:companyId — List company roles & configuration status
router.get('/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;

    const result = await pool.query(
      `SELECT cr.id, cr.title, cr.description, cr.status as role_status,
              cac.id as config_id, cac.status as config_status, cac.locked_at,
              ccv.id as version_id, ccv.version_number, ccv.selected_module_ids
       FROM company_roles cr
       LEFT JOIN company_assessment_configurations cac ON cr.id = cac.company_role_id
       LEFT JOIN company_configuration_versions ccv ON cac.id = ccv.configuration_id AND ccv.status = 'active'
       WHERE cr.company_id = $1 OR LOWER(cr.company_id::text) = LOWER($1::text)
       ORDER BY cr.created_at DESC`,
      [companyId]
    );

    res.json({ companyRoles: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. POST /company-roles — Create new role for company
router.post('/', async (req, res) => {
  try {
    const { companyId, title, description, canonicalRoleId } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Role title is required.' });
    }

    const crRes = await pool.query(
      `INSERT INTO company_roles (company_id, canonical_role_id, title, description)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, company_id`,
      [companyId || 1, canonicalRoleId || null, title, description || '']
    );

    const companyRole = crRes.rows[0];

    // Create draft configuration record
    const configRes = await pool.query(
      `INSERT INTO company_assessment_configurations (company_id, company_role_id, status)
       VALUES ($1, $2, 'draft')
       ON CONFLICT (company_id, company_role_id) DO UPDATE SET status = company_assessment_configurations.status
       RETURNING id, status`,
      [companyId || 1, companyRole.id]
    );

    res.json({ success: true, companyRole, configuration: configRes.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST /company-roles/:roleId/configuration/lock — Lock configuration after agreement (Rule §10, §11, §12)
router.post('/:roleId/configuration/lock', async (req, res) => {
  try {
    const { roleId } = req.params;
    const { companyId, selectedModuleIds, acceptedAgreement, acceptedBy, ipAddress } = req.body;

    // Enforce 4 - 6 requirements rule (Rule §10)
    if (!selectedModuleIds || !Array.isArray(selectedModuleIds) || selectedModuleIds.length < 4 || selectedModuleIds.length > 6) {
      return res.status(400).json({
        error: `Company configuration must contain between 4 and 6 assessment requirements. You selected ${selectedModuleIds?.length || 0}.`,
      });
    }

    // Enforce agreement acceptance (Rule §11)
    if (!acceptedAgreement) {
      return res.status(400).json({
        error: 'You must explicitly review and accept the Assessment Configuration Agreement before locking.',
      });
    }

    // Check if already locked
    const checkRes = await pool.query(
      `SELECT id, status FROM company_assessment_configurations WHERE company_role_id = $1 LIMIT 1`,
      [roleId]
    );

    if (checkRes.rows.length > 0 && checkRes.rows[0].status === 'locked') {
      return res.status(423).json({
        error: 'Configuration is LOCKED. Direct edits are disabled. Please request a configuration change via an active subscription plan.',
        isLocked: true,
      });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Get configuration id
      let configId = checkRes.rows[0]?.id;
      if (!configId) {
        const cRes = await client.query(
          `INSERT INTO company_assessment_configurations (company_id, company_role_id, status)
           VALUES ($1, $2, 'draft') RETURNING id`,
          [companyId || 1, roleId]
        );
        configId = cRes.rows[0].id;
      }

      // 2. Create V1 version
      const vRes = await client.query(
        `INSERT INTO company_configuration_versions
           (configuration_id, version_number, company_id, company_role_id, selected_module_ids, status, created_by)
         VALUES ($1, 1, $2, $3, $4, 'active', $5)
         RETURNING id`,
        [configId, companyId || 1, roleId, selectedModuleIds, acceptedBy || 1]
      );
      const versionId = vRes.rows[0].id;

      // 3. Insert requirements per module
      for (const modId of selectedModuleIds) {
        await client.query(
          `INSERT INTO company_configuration_requirements
             (configuration_version_id, assessment_module_id, weight, is_required)
           VALUES ($1, $2, 1.0, true)`,
          [versionId, modId]
        );
      }

      // 4. Lock configuration status
      await client.query(
        `UPDATE company_assessment_configurations SET status = 'locked', locked_at = NOW() WHERE id = $1`,
        [configId]
      );

      // 5. Insert agreement record
      const agreementText = `I confirm that the selected assessment requirements accurately represent the role requirements. I understand that GenuAI Works will use these requirements for dynamic path orchestration. After confirmation, the configuration is locked. Modifying a locked configuration requires an applicable paid subscription. Previous configuration versions remain preserved.`;

      await client.query(
        `INSERT INTO company_configuration_agreements
           (configuration_id, configuration_version_id, company_id, accepted_by, agreement_text, accepted_at, ip_address)
         VALUES ($1, $2, $3, $4, $5, NOW(), $6)`,
        [configId, versionId, companyId || 1, acceptedBy || 1, agreementText, ipAddress || '127.0.0.1']
      );

      await client.query('COMMIT');
      res.json({ success: true, isLocked: true, versionId, versionNumber: 1 });
    } catch (err: any) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. POST /company-roles/:roleId/configuration/change-request — Initiate change request for locked config (Rule §14)
router.post('/:roleId/configuration/change-request', async (req, res) => {
  try {
    const { roleId } = req.params;
    const { companyId, reason, subscriptionId } = req.body;

    const configRes = await pool.query(
      `SELECT cac.id as config_id, ccv.id as current_version_id
       FROM company_assessment_configurations cac
       JOIN company_configuration_versions ccv ON cac.id = ccv.configuration_id AND ccv.status = 'active'
       WHERE cac.company_role_id = $1 LIMIT 1`,
      [roleId]
    );

    if (configRes.rows.length === 0) {
      return res.status(404).json({ error: 'Configuration not found for role.' });
    }

    const { config_id, current_version_id } = configRes.rows[0];

    const reqRes = await pool.query(
      `INSERT INTO configuration_change_requests
         (company_id, configuration_id, current_version_id, subscription_id, reason, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING id, status, requested_at`,
      [companyId || 1, config_id, current_version_id, subscriptionId || null, reason || 'Role requirement updates.']
    );

    res.json({ success: true, changeRequest: reqRes.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

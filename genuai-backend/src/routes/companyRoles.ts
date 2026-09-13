import express from 'express';
import pool from '../db';

const router = express.Router();

// ─────────────────────────────────────────────
// 0. Assessment Library & Departments
// ─────────────────────────────────────────────

// GET /company-roles/modules — List all available assessment modules from centralized library
router.get('/modules', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, canonical_name, category, description, is_composite, status
       FROM assessment_modules
       WHERE status = 'active' OR status IS NULL
       ORDER BY category ASC, id ASC`
    );
    res.json({ modules: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /company-roles/departments/:companyId — List company departments
router.get('/departments/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    const result = await pool.query(
      `SELECT d.*, 
              (SELECT COUNT(*) FROM company_roles cr WHERE cr.department_id = d.id) as roles_count,
              (SELECT COUNT(*) FROM company_roles cr WHERE cr.department_id = d.id AND cr.workflow_status = 'ACTIVE') as active_roles_count
       FROM departments d
       WHERE d.company_id = $1 OR LOWER(d.company_id::text) = LOWER($1::text)
       ORDER BY d.created_at ASC`,
      [companyId]
    );
    res.json({ departments: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /company-roles/departments — Create department
router.post('/departments', async (req, res) => {
  try {
    const { companyId, name, code, description } = req.body;
    if (!companyId || !name) {
      return res.status(400).json({ error: 'Company ID and Department Name are required.' });
    }

    const result = await pool.query(
      `INSERT INTO departments (company_id, name, code, description, status)
       VALUES ($1, $2, $3, $4, 'active')
       ON CONFLICT (company_id, name) DO UPDATE SET 
         code = COALESCE($3, departments.code),
         description = COALESCE($4, departments.description),
         status = 'active',
         updated_at = NOW()
       RETURNING *`,
      [companyId, name.trim(), code || null, description || null]
    );

    res.json({ success: true, department: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /company-roles/departments/:id — Update department
router.put('/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, status } = req.body;

    const result = await pool.query(
      `UPDATE departments SET
         name = COALESCE($1, name),
         code = COALESCE($2, code),
         description = COALESCE($3, description),
         status = COALESCE($4, status),
         updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [name?.trim(), code, description, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Department not found.' });
    }

    res.json({ success: true, department: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /company-roles/departments/:id — Deactivate department
router.delete('/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE departments SET status = 'inactive', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );
    res.json({ success: true, message: 'Department deactivated.', department: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 1. Roles & Requirements Management
// ─────────────────────────────────────────────

// GET /company-roles/:companyId — List all company roles with full status & department details
router.get('/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;

    const result = await pool.query(
      `SELECT cr.id, cr.company_id, cr.department_id, cr.title, cr.description,
              cr.experience_level, cr.employment_type, cr.location, cr.vacancies,
              cr.workflow_status, cr.admin_feedback, cr.submitted_at, cr.reviewed_at,
              cr.status as role_status, cr.canonical_role_id,
              d.name as department_name, d.code as department_code,
              rt.canonical_name as canonical_role_name,
              cac.id as config_id, cac.status as config_status, cac.locked_at,
              ccv.id as version_id, ccv.version_number, ccv.selected_module_ids, ccv.created_at as version_created_at,
              (SELECT COUNT(*) FROM company_role_skills crs WHERE crs.company_role_id = cr.id) as skills_count,
              (SELECT json_agg(crs.*) FROM company_role_skills crs WHERE crs.company_role_id = cr.id) as skills
       FROM company_roles cr
       LEFT JOIN departments d ON cr.department_id = d.id
       LEFT JOIN role_taxonomy rt ON cr.canonical_role_id = rt.id
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

// GET /company-roles/role/:roleId — Single role detailed view
router.get('/role/:roleId', async (req, res) => {
  try {
    const { roleId } = req.params;

    const roleRes = await pool.query(
      `SELECT cr.*, 
              d.name as department_name, d.code as department_code,
              rt.canonical_name as canonical_role_name,
              cac.id as config_id, cac.status as config_status, cac.locked_at,
              ccv.id as version_id, ccv.version_number, ccv.selected_module_ids, ccv.weightages,
              cp.company_name, cp.verification_status as company_verification_status
       FROM company_roles cr
       LEFT JOIN departments d ON cr.department_id = d.id
       LEFT JOIN role_taxonomy rt ON cr.canonical_role_id = rt.id
       LEFT JOIN company_assessment_configurations cac ON cr.id = cac.company_role_id
       LEFT JOIN company_configuration_versions ccv ON cac.id = ccv.configuration_id AND ccv.status = 'active'
       LEFT JOIN company_profiles cp ON cr.company_id = cp.user_id
       WHERE cr.id = $1`,
      [roleId]
    );

    if (roleRes.rows.length === 0) {
      return res.status(404).json({ error: 'Role not found.' });
    }

    const role = roleRes.rows[0];

    // Fetch skills
    const skillsRes = await pool.query(
      `SELECT * FROM company_role_skills WHERE company_role_id = $1 ORDER BY category ASC, id ASC`,
      [roleId]
    );

    // Fetch requirements per module if version exists
    let requirements: any[] = [];
    if (role.version_id) {
      const reqRes = await pool.query(
        `SELECT ccr.*, am.name as module_name, am.canonical_name as module_canonical_name, am.category as module_category, am.description as module_description
         FROM company_configuration_requirements ccr
         JOIN assessment_modules am ON ccr.assessment_module_id = am.id
         WHERE ccr.configuration_version_id = $1
         ORDER BY am.category ASC, am.id ASC`,
        [role.version_id]
      );
      requirements = reqRes.rows;
    }

    res.json({
      role,
      skills: skillsRes.rows,
      requirements,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /company-roles — Create new role for company
router.post('/', async (req, res) => {
  try {
    const {
      companyId,
      departmentId,
      title,
      description,
      experienceLevel,
      employmentType,
      location,
      vacancies,
      canonicalRoleId,
      skills,
      selectedModuleIds,
      modulePriorities,
    } = req.body;

    if (!companyId || !title) {
      return res.status(400).json({ error: 'Company ID and Role Title are required.' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const crRes = await client.query(
        `INSERT INTO company_roles (
           company_id, department_id, canonical_role_id, title, description,
           experience_level, employment_type, location, vacancies, workflow_status, status
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'DRAFT', 'active')
         RETURNING *`,
        [
          companyId,
          departmentId || null,
          canonicalRoleId || null,
          title.trim(),
          description || '',
          experienceLevel || 'Mid-Level',
          employmentType || 'Full-time',
          location || 'Remote',
          vacancies || 1,
        ]
      );

      const companyRole = crRes.rows[0];

      // Insert skills if provided
      if (skills && Array.isArray(skills)) {
        for (const s of skills) {
          if (s.skill_name || s.name) {
            await client.query(
              `INSERT INTO company_role_skills (company_role_id, skill_name, category, priority, is_required, status)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [
                companyRole.id,
                (s.skill_name || s.name).trim(),
                s.category || 'TECHNICAL',
                s.priority || 'HIGH',
                s.is_required !== false,
                s.status || (s.is_required !== false ? 'REQUIRED' : 'PREFERRED'),
              ]
            );
          }
        }
      }

      // Create draft configuration record
      const configRes = await client.query(
        `INSERT INTO company_assessment_configurations (company_id, company_role_id, status)
         VALUES ($1, $2, 'draft')
         ON CONFLICT (company_id, company_role_id) DO UPDATE SET status = company_assessment_configurations.status
         RETURNING id, status`,
        [companyId, companyRole.id]
      );
      const configId = configRes.rows[0].id;

      // Save initial module selection if provided
      if (selectedModuleIds && Array.isArray(selectedModuleIds) && selectedModuleIds.length > 0) {
        // Create draft version
        const vRes = await client.query(
          `INSERT INTO company_configuration_versions (
             configuration_id, version_number, company_id, company_role_id,
             canonical_role_id, selected_module_ids, weightages, status, created_by
           ) VALUES ($1, 1, $2, $3, $4, $5, $6, 'active', $7)
           RETURNING id`,
          [
            configId,
            companyId,
            companyRole.id,
            canonicalRoleId || null,
            selectedModuleIds,
            JSON.stringify(modulePriorities || {}),
            companyId,
          ]
        );
        const versionId = vRes.rows[0].id;

        for (const modId of selectedModuleIds) {
          const prio = modulePriorities ? (modulePriorities[modId] || 'HIGH') : 'HIGH';
          await client.query(
            `INSERT INTO company_configuration_requirements (
               configuration_version_id, assessment_module_id, priority, weight, is_required
             ) VALUES ($1, $2, $3, $4, true)`,
            [versionId, modId, prio, 1.0]
          );
        }
      }

      await client.query('COMMIT');
      res.json({ success: true, companyRole, configuration: configRes.rows[0] });
    } catch (txErr: any) {
      await client.query('ROLLBACK');
      throw txErr;
    } finally {
      client.release();
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /company-roles/:id — Update role basic info
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      departmentId,
      title,
      description,
      experienceLevel,
      employmentType,
      location,
      vacancies,
      canonicalRoleId,
    } = req.body;

    const result = await pool.query(
      `UPDATE company_roles SET
         department_id = COALESCE($1, department_id),
         canonical_role_id = COALESCE($2, canonical_role_id),
         title = COALESCE($3, title),
         description = COALESCE($4, description),
         experience_level = COALESCE($5, experience_level),
         employment_type = COALESCE($6, employment_type),
         location = COALESCE($7, location),
         vacancies = COALESCE($8, vacancies)
       WHERE id = $9 RETURNING *`,
      [departmentId, canonicalRoleId, title?.trim(), description, experienceLevel, employmentType, location, vacancies, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Role not found.' });
    }

    res.json({ success: true, companyRole: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /company-roles/:id/skills — Save / update skills for role
router.put('/:id/skills', async (req, res) => {
  try {
    const { id } = req.params; // roleId
    const { skills } = req.body; // array of { skill_name, category, priority, status, is_required }

    if (!Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills must be an array.' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Clear existing skills for this role
      await client.query(`DELETE FROM company_role_skills WHERE company_role_id = $1`, [id]);

      // Insert updated skills
      for (const s of skills) {
        if (s.skill_name || s.name) {
          await client.query(
            `INSERT INTO company_role_skills (company_role_id, skill_name, category, priority, is_required, status)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              id,
              (s.skill_name || s.name).trim(),
              s.category || 'TECHNICAL',
              s.priority || 'HIGH',
              s.is_required !== false,
              s.status || (s.is_required !== false ? 'REQUIRED' : 'PREFERRED'),
            ]
          );
        }
      }

      await client.query('COMMIT');

      const updatedSkills = await pool.query(
        `SELECT * FROM company_role_skills WHERE company_role_id = $1 ORDER BY category ASC, id ASC`,
        [id]
      );

      res.json({ success: true, skills: updatedSkills.rows });
    } catch (txErr: any) {
      await client.query('ROLLBACK');
      throw txErr;
    } finally {
      client.release();
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /company-roles/:id/submit — Submit role configuration for GenuAI Admin verification
router.post('/:id/submit', async (req, res) => {
  try {
    const { id } = req.params; // roleId
    const { companyId } = req.body;

    // 1. Verify role exists
    const roleRes = await pool.query(`SELECT * FROM company_roles WHERE id = $1`, [id]);
    if (roleRes.rows.length === 0) {
      return res.status(404).json({ error: 'Role not found.' });
    }
    const role = roleRes.rows[0];

    // 2. Validate skill requirements
    const skillsRes = await pool.query(`SELECT COUNT(*) FROM company_role_skills WHERE company_role_id = $1`, [id]);
    const skillCount = parseInt(skillsRes.rows[0]?.count || '0', 10);
    if (skillCount === 0) {
      return res.status(400).json({ error: 'Please configure at least one required skill before submitting.' });
    }

    // 3. Validate assessment requirements exist
    const configRes = await pool.query(
      `SELECT ccv.* FROM company_assessment_configurations cac
       JOIN company_configuration_versions ccv ON cac.id = ccv.configuration_id AND ccv.status = 'active'
       WHERE cac.company_role_id = $1`,
      [id]
    );

    if (configRes.rows.length === 0 || !configRes.rows[0].selected_module_ids || configRes.rows[0].selected_module_ids.length === 0) {
      return res.status(400).json({ error: 'Please select and save applicable assessment requirements before submitting.' });
    }

    // 4. Update role status to SUBMITTED
    const updateRes = await pool.query(
      `UPDATE company_roles SET
         workflow_status = 'SUBMITTED',
         submitted_at = NOW(),
         admin_feedback = NULL
       WHERE id = $1 RETURNING *`,
      [id]
    );

    res.json({
      success: true,
      workflow_status: 'SUBMITTED',
      message: 'Role configuration submitted for GenuAI Admin verification.',
      role: updateRes.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /company-roles/:id/configuration — Save draft module selections & priorities
router.post('/:id/configuration', async (req, res) => {
  try {
    const { id } = req.params; // roleId
    const { companyId, selectedModuleIds, modulePriorities, canonicalRoleId } = req.body;

    if (!selectedModuleIds || !Array.isArray(selectedModuleIds) || selectedModuleIds.length === 0) {
      return res.status(400).json({ error: 'Please select at least one assessment requirement.' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Get or create configuration
      let configRes = await client.query(
        `SELECT id, status FROM company_assessment_configurations WHERE company_role_id = $1 LIMIT 1`,
        [id]
      );

      let configId: number;
      if (configRes.rows.length === 0) {
        const insRes = await client.query(
          `INSERT INTO company_assessment_configurations (company_id, company_role_id, status)
           VALUES ($1, $2, 'draft') RETURNING id`,
          [companyId || 1, id]
        );
        configId = insRes.rows[0].id;
      } else {
        configId = configRes.rows[0].id;
      }

      // 2. Check if active version exists, or create new version
      let versionRes = await client.query(
        `SELECT id, version_number FROM company_configuration_versions
         WHERE configuration_id = $1 AND status = 'active'
         ORDER BY version_number DESC LIMIT 1`,
        [configId]
      );

      let versionId: number;
      if (versionRes.rows.length === 0) {
        const vIns = await client.query(
          `INSERT INTO company_configuration_versions (
             configuration_id, version_number, company_id, company_role_id,
             canonical_role_id, selected_module_ids, weightages, status, created_by
           ) VALUES ($1, 1, $2, $3, $4, $5, $6, 'active', $7)
           RETURNING id`,
          [
            configId,
            companyId || 1,
            id,
            canonicalRoleId || null,
            selectedModuleIds,
            JSON.stringify(modulePriorities || {}),
            companyId || 1,
          ]
        );
        versionId = vIns.rows[0].id;
      } else {
        versionId = versionRes.rows[0].id;
        // Update version module selection and priorities
        await client.query(
          `UPDATE company_configuration_versions SET
             selected_module_ids = $1,
             weightages = $2,
             canonical_role_id = COALESCE($3, canonical_role_id)
           WHERE id = $4`,
          [selectedModuleIds, JSON.stringify(modulePriorities || {}), canonicalRoleId || null, versionId]
        );

        // Clear existing requirements for this version
        await client.query(
          `DELETE FROM company_configuration_requirements WHERE configuration_version_id = $1`,
          [versionId]
        );
      }

      // 3. Insert requirements for each module
      for (const modId of selectedModuleIds) {
        const prio = modulePriorities ? (modulePriorities[modId] || 'HIGH') : 'HIGH';
        await client.query(
          `INSERT INTO company_configuration_requirements (
             configuration_version_id, assessment_module_id, priority, weight, is_required
           ) VALUES ($1, $2, $3, $4, true)`,
          [versionId, modId, prio, 1.0]
        );
      }

      await client.query('COMMIT');

      res.json({
        success: true,
        configurationId: configId,
        versionId,
        selectedModuleIds,
        modulePriorities,
        message: 'Assessment requirements configuration saved.',
      });
    } catch (txErr: any) {
      await client.query('ROLLBACK');
      throw txErr;
    } finally {
      client.release();
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. POST /company-roles/:id/configuration/agree — Record agreement confirmation (Rule §11)
router.post('/:id/configuration/agree', async (req, res) => {
  try {
    const { id } = req.params; // roleId
    const { companyId, acceptedBy, ipAddress, agreementText } = req.body;

    const configRes = await pool.query(
      `SELECT id, status FROM company_assessment_configurations WHERE company_role_id = $1 LIMIT 1`,
      [id]
    );

    if (configRes.rows.length === 0) {
      return res.status(404).json({ error: 'Configuration not found for this role.' });
    }

    const configId = configRes.rows[0].id;
    const standardText =
      agreementText ||
      `I confirm that the selected assessment requirements accurately represent the role requirements. I understand that GenuAI Works will use these requirements for dynamic path orchestration. After confirmation, the configuration is locked.`;

    const agreeRes = await pool.query(
      `INSERT INTO company_configuration_agreements
         (configuration_id, company_id, accepted_by, agreement_text, accepted_at, ip_address)
       VALUES ($1, $2, $3, $4, NOW(), $5)
       RETURNING id, accepted_at`,
      [configId, companyId || 1, acceptedBy || 1, standardText, ipAddress || '127.0.0.1']
    );

    res.json({ success: true, agreement: agreeRes.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. POST /company-roles/:roleId/configuration/lock — Lock configuration after agreement (Rule §10, §11, §12)
router.post('/:roleId/configuration/lock', async (req, res) => {
  try {
    const { roleId } = req.params;
    const { companyId, selectedModuleIds, moduleWeights, acceptedAgreement, acceptedBy, ipAddress } = req.body;

    // Enforce 4 - 6 requirements rule (Rule §10)
    if (!selectedModuleIds || !Array.isArray(selectedModuleIds) || selectedModuleIds.length < 4 || selectedModuleIds.length > 6) {
      return res.status(400).json({
        error: `Company configuration must contain between 4 and 6 assessment requirements. You selected ${selectedModuleIds?.length || 0}.`,
      });
    }

    // Validate weights sum to ~1.0 if provided
    if (moduleWeights && typeof moduleWeights === 'object') {
      const sumVal: number = (Object.values(moduleWeights) as any[]).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);
      if (Math.abs(sumVal - 1.0) > 0.05 && sumVal > 0) {
        return res.status(400).json({
          error: `Requirement weights must sum to 1.0 (current sum: ${sumVal.toFixed(2)}).`,
        });
      }
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
        error: 'Configuration is already LOCKED. Direct edits are disabled. Please request a configuration change via an active subscription plan.',
        isLocked: true,
      });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Get or create configuration id
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
           (configuration_id, version_number, company_id, company_role_id, selected_module_ids, weightages, status, created_by)
         VALUES ($1, 1, $2, $3, $4, $5, 'active', $6)
         RETURNING id, version_number, created_at`,
        [
          configId,
          companyId || 1,
          roleId,
          selectedModuleIds,
          moduleWeights ? JSON.stringify(moduleWeights) : null,
          acceptedBy || 1,
        ]
      );
      const versionId = vRes.rows[0].id;
      const lockedAt = vRes.rows[0].created_at;

      // 3. Insert requirements per module
      const defaultWeight = 1.0 / selectedModuleIds.length;
      for (const modId of selectedModuleIds) {
        const weight = moduleWeights && moduleWeights[modId] !== undefined ? Number(moduleWeights[modId]) : defaultWeight;
        await client.query(
          `INSERT INTO company_configuration_requirements
             (configuration_version_id, assessment_module_id, weight, is_required)
           VALUES ($1, $2, $3, true)`,
          [versionId, modId, weight]
        );
      }

      // 4. Lock configuration status
      await client.query(
        `UPDATE company_assessment_configurations SET status = 'locked', locked_at = NOW() WHERE id = $1`,
        [configId]
      );

      // 5. Insert agreement record
      const agreementText = `I confirm that the selected assessment requirements accurately represent the role requirements for role #${roleId}. I understand that GenuAI Works will use these requirements for dynamic path orchestration. After confirmation, the configuration is locked. Modifying a locked configuration requires an applicable paid subscription. Previous configuration versions remain preserved.`;

      await client.query(
        `INSERT INTO company_configuration_agreements
           (configuration_id, configuration_version_id, company_id, accepted_by, agreement_text, accepted_at, ip_address)
         VALUES ($1, $2, $3, $4, $5, NOW(), $6)`,
        [configId, versionId, companyId || 1, acceptedBy || 1, agreementText, ipAddress || '127.0.0.1']
      );

      await client.query('COMMIT');
      res.json({
        success: true,
        isLocked: true,
        versionId,
        versionNumber: 1,
        status: 'locked',
        lockedAt,
        selectedModuleIds,
      });
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

// 6. GET /company-roles/matches/:companyId — Get real candidate match dashboard data for this company
router.get('/matches/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;

    const matchesQuery = await pool.query(
      `SELECT ccm.id, ccm.candidate_id, ccm.company_id, ccm.configuration_version_id,
              ccm.match_score, ccm.score_components, ccm.strengths, ccm.weak_areas,
              ccm.explanation, ccm.created_at,
              u.name as candidate_name, u.email as candidate_email, u.college, u.github, u.linkedin,
              cr.title as role_title,
              ccv.version_number, ccv.created_at as version_locked_at,
              cag.id as group_id, cag.assessment_pattern_hash, cag.pattern_description
       FROM candidate_company_matches ccm
       JOIN users u ON ccm.candidate_id = u.id
       LEFT JOIN company_configuration_versions ccv ON ccm.configuration_version_id = ccv.id
       LEFT JOIN company_roles cr ON ccv.company_role_id = cr.id
       LEFT JOIN candidate_group_memberships cgm ON ccm.candidate_id = cgm.candidate_id
       LEFT JOIN candidate_assessment_groups cag ON cgm.group_id = cag.id
       WHERE ccm.company_id = $1 OR LOWER(ccm.company_id::text) = LOWER($1::text)
       ORDER BY ccm.created_at DESC`,
      [companyId]
    );

    res.json({ matches: matchesQuery.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. POST /company-roles/:roleId/configuration/change-request — Initiate change request for locked config (Rule §14)
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

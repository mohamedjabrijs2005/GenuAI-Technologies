import express from 'express';
import { verifyToken } from '../config/jwt';
import pool from '../db';
import { CareerContextService } from '../services/careerContextService';

const router = express.Router();
const getAuthUserId = (req: express.Request): number | null => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const decoded = verifyToken(authHeader.split(' ')[1]);
      if (decoded?.id) return Number(decoded.id);
    }
  } catch {
    // Ignore token parse error
  }
  return null;
};

// ─────────────────────────────────────────────
// 1. GET /candidate/interests/career-options — Hierarchical Verified Companies & Active Roles
// ─────────────────────────────────────────────
router.get('/career-options', async (_req, res) => {
  try {
    const dbRes = await pool.query(
      `SELECT 
         u.id as company_id,
         COALESCE(cp.company_name, u.name) as company_name,
         COALESCE(cp.industry, 'Technology') as industry,
         COALESCE(cp.location, 'Remote') as location,
         cr.id as role_id,
         cr.title as role_title,
         cr.experience_level,
         cr.employment_type,
         d.id as department_id,
         COALESCE(d.name, 'General') as department_name
       FROM users u
       JOIN company_profiles cp ON u.id = cp.user_id
       JOIN company_roles cr ON u.id = cr.company_id
       LEFT JOIN departments d ON cr.department_id = d.id
       WHERE u.role = 'company'
         AND (cp.verification_status = 'VERIFIED' OR cp.is_verified = true)
         AND cr.workflow_status = 'ACTIVE'
         AND LOWER(u.name) NOT LIKE '%mohamed jabri%'
         AND LOWER(u.name) NOT LIKE '%demo company%'
         AND LOWER(u.name) NOT LIKE '%nigga%'
         AND LOWER(TRIM(u.name)) NOT IN ('company', 'test', 'admin')
       ORDER BY company_name ASC, department_name ASC, cr.title ASC`
    );

    const compMap = new Map<number, any>();

    for (const row of dbRes.rows) {
      if (!compMap.has(row.company_id)) {
        compMap.set(row.company_id, {
          companyId: row.company_id,
          companyName: row.company_name,
          industry: row.industry,
          location: row.location,
          departments: [],
        });
      }

      const comp = compMap.get(row.company_id)!;
      let dept = comp.departments.find((d: any) => d.departmentName === row.department_name);
      if (!dept) {
        dept = {
          departmentId: row.department_id || 0,
          departmentName: row.department_name,
          roles: [],
        };
        comp.departments.push(dept);
      }

      dept.roles.push({
        id: row.role_id,
        title: row.role_title,
        experienceLevel: row.experience_level || 'Mid-Level',
        employmentType: row.employment_type || 'Full-time',
      });
    }

    res.json({ options: Array.from(compMap.values()) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 2. GET /candidate/interests & GET /candidate/interests/:candidateId
// ─────────────────────────────────────────────
const handleGetInterests = async (req: express.Request, res: express.Response) => {
  try {
    const authId = getAuthUserId(req);
    const rawParam = req.params.candidateId;
    const paramStr = typeof rawParam === 'string' ? rawParam : Array.isArray(rawParam) ? rawParam[0] : null;
    const paramId = paramStr ? parseInt(paramStr, 10) : null;
    const candidateId = authId || paramId;

    if (!candidateId) {
      return res.status(401).json({ error: 'Authentication required to view career targets.' });
    }

    const dbRes = await pool.query(
      `SELECT 
         cri.id,
         cri.candidate_id,
         cri.company_id,
         COALESCE(cp.company_name, u.name, 'Company #' || cri.company_id) as company_name,
         COALESCE(cp.industry, 'Technology') as industry,
         COALESCE(cp.location, 'Remote') as location,
         cri.company_role_id,
         COALESCE(cr.title, 'Software Engineer') as role_title,
         COALESCE(d.name, 'General') as department_name,
         COALESCE(cr.experience_level, 'Mid-Level') as experience_level,
         (COALESCE(cp.verification_status, 'UNVERIFIED') = 'VERIFIED' AND COALESCE(cr.workflow_status, 'DRAFT') = 'ACTIVE') as is_available,
         cri.created_at
       FROM candidate_role_interests cri
       LEFT JOIN users u ON cri.company_id = u.id
       LEFT JOIN company_profiles cp ON u.id = cp.user_id
       LEFT JOIN company_roles cr ON cri.company_role_id = cr.id
       LEFT JOIN departments d ON cr.department_id = d.id
       WHERE cri.candidate_id = $1 
         AND (cri.status IS NULL OR cri.status = 'active')
       ORDER BY cri.created_at DESC`,
      [candidateId]
    );

    const targets = dbRes.rows.map(r => ({
      id: r.id,
      candidateId: r.candidate_id,
      companyId: r.company_id,
      companyName: r.company_name,
      industry: r.industry,
      location: r.location,
      companyRoleId: r.company_role_id,
      roleTitle: r.role_title,
      departmentName: r.department_name,
      experienceLevel: r.experience_level,
      isAvailable: Boolean(r.is_available),
      availabilityLabel: Boolean(r.is_available) ? 'Live Opportunity' : 'Currently unavailable',
      createdAt: r.created_at,
    }));

    res.json({ targets, selections: targets });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

router.get('/', handleGetInterests);
router.get('/:candidateId', handleGetInterests);

// ─────────────────────────────────────────────
// 3. POST /candidate/interests & POST /candidate/interests/:candidateId
// ─────────────────────────────────────────────
const handlePostInterest = async (req: express.Request, res: express.Response) => {
  try {
    const authId = getAuthUserId(req);
    const rawParam = req.params.candidateId;
    const paramStr = typeof rawParam === 'string' ? rawParam : Array.isArray(rawParam) ? rawParam[0] : null;
    const paramId = paramStr ? parseInt(paramStr, 10) : null;
    const candidateId = authId || paramId;

    if (!candidateId) {
      return res.status(401).json({ error: 'Authentication required to add career target.' });
    }

    const { companyId, companyRoleId, roleId, selections } = req.body;
    const itemsToAdd: { companyId: number; companyRoleId: number }[] = [];

    if (Array.isArray(selections)) {
      for (const s of selections) {
        if (s.companyId && (s.companyRoleId || s.roleId)) {
          itemsToAdd.push({
            companyId: parseInt(String(s.companyId), 10),
            companyRoleId: parseInt(String(s.companyRoleId || s.roleId), 10),
          });
        }
      }
    } else if (companyId && (companyRoleId || roleId)) {
      itemsToAdd.push({
        companyId: parseInt(String(companyId), 10),
        companyRoleId: parseInt(String(companyRoleId || roleId), 10),
      });
    }

    if (itemsToAdd.length === 0) {
      return res.status(400).json({ error: 'Valid companyId and companyRoleId are required.' });
    }

    const addedTargets = [];

    for (const item of itemsToAdd) {
      // Backend Validation Rule 1-6
      // 1. Company must exist and be VERIFIED
      const compCheck = await pool.query(
        `SELECT u.id, cp.verification_status, cp.is_verified
         FROM users u
         LEFT JOIN company_profiles cp ON u.id = cp.user_id
         WHERE u.id = $1 AND u.role = 'company'`,
        [item.companyId]
      );

      if (compCheck.rows.length === 0) {
        return res.status(400).json({ error: `Specified company (#${item.companyId}) does not exist.` });
      }

      const compRow = compCheck.rows[0];
      const isVerified = compRow.verification_status === 'VERIFIED' || compRow.is_verified === true;
      if (!isVerified) {
        return res.status(400).json({ error: 'Cannot add career target for an unverified or suspended company.' });
      }

      // 2. Role must exist, belong to company, and be ACTIVE
      const roleCheck = await pool.query(
        `SELECT id, company_id, title, workflow_status
         FROM company_roles
         WHERE id = $1 AND company_id = $2`,
        [item.companyRoleId, item.companyId]
      );

      if (roleCheck.rows.length === 0) {
        return res.status(400).json({ error: 'Specified role does not exist for this company.' });
      }

      const roleRow = roleCheck.rows[0];
      if (roleRow.workflow_status !== 'ACTIVE') {
        return res.status(400).json({ error: 'Cannot add career target for a role that is not currently ACTIVE.' });
      }

      // 3. Check for existing duplicate combination
      const dupCheck = await pool.query(
        `SELECT id FROM candidate_role_interests
         WHERE candidate_id = $1 AND company_id = $2 AND company_role_id = $3 AND (status IS NULL OR status = 'active')`,
        [candidateId, item.companyId, item.companyRoleId]
      );

      if (dupCheck.rows.length > 0) {
        addedTargets.push({ id: dupCheck.rows[0].id, companyId: item.companyId, companyRoleId: item.companyRoleId, exists: true });
        continue;
      }

      // 4. Save into candidate_company_interests & candidate_role_interests
      await pool.query(
        `INSERT INTO candidate_company_interests (candidate_id, company_id, status)
         VALUES ($1, $2, 'active')
         ON CONFLICT (candidate_id, company_id) DO UPDATE SET status = 'active'`,
        [candidateId, item.companyId]
      );

      const insRes = await pool.query(
        `INSERT INTO candidate_role_interests (candidate_id, company_id, company_role_id, interest_status, status, created_at, updated_at)
         VALUES ($1, $2, $3, 'INTERESTED', 'active', NOW(), NOW())
         ON CONFLICT (candidate_id, company_id, company_role_id) DO UPDATE SET status = 'active', updated_at = NOW()
         RETURNING id`,
        [candidateId, item.companyId, item.companyRoleId]
      );

      addedTargets.push({
        id: insRes.rows[0]?.id,
        companyId: item.companyId,
        companyRoleId: item.companyRoleId,
      });
    }

    res.json({ success: true, count: addedTargets.length, targets: addedTargets });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

router.post('/', handlePostInterest);
router.post('/:candidateId', handlePostInterest);

// ─────────────────────────────────────────────
// 4. DELETE /candidate/interests/:targetId & DELETE /candidate/interests
// ─────────────────────────────────────────────
const handleDeleteInterest = async (req: express.Request, res: express.Response) => {
  try {
    const authId = getAuthUserId(req);
    const rawQueryCand = req.query.candidateId;
    const queryCandStr = typeof rawQueryCand === 'string' ? rawQueryCand : Array.isArray(rawQueryCand) ? String(rawQueryCand[0]) : null;
    const paramCandidateId = queryCandStr ? parseInt(queryCandStr, 10) : null;
    const candidateId = authId || paramCandidateId;

    if (!candidateId) {
      return res.status(401).json({ error: 'Authentication required to remove career target.' });
    }

    const rawTargetParam = req.params.targetId;
    const targetId = typeof rawTargetParam === 'string' ? rawTargetParam : Array.isArray(rawTargetParam) ? rawTargetParam[0] : null;

    if (targetId && targetId !== 'clear-all') {
      const idNum = parseInt(targetId, 10);
      await pool.query(
        `DELETE FROM candidate_role_interests 
         WHERE (id = $1 OR company_role_id = $1) AND candidate_id = $2`,
        [idNum, candidateId]
      );
    } else {
      await pool.query(
        `UPDATE candidate_role_interests SET status = 'cleared' WHERE candidate_id = $1`,
        [candidateId]
      );
    }

    res.json({ success: true, message: 'Career target removed successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

router.delete('/:targetId', handleDeleteInterest);
router.delete('/', handleDeleteInterest);

// ─────────────────────────────────────────────
// 5. GET /candidate/interests/context & GET /candidate/interests/context/:candidateId — Personalization Context
// ─────────────────────────────────────────────
const handleGetContext = async (req: express.Request, res: express.Response) => {
  try {
    const authId = getAuthUserId(req);
    const rawParam = req.params.candidateId;
    const paramStr = typeof rawParam === 'string' ? rawParam : Array.isArray(rawParam) ? rawParam[0] : null;
    const paramId = paramStr ? parseInt(paramStr, 10) : null;
    const candidateId = authId || paramId;

    if (!candidateId) {
      return res.status(401).json({ error: 'Authentication required for personalization context.' });
    }

    const context = await CareerContextService.getCandidateCareerInterestContext(candidateId);
    res.json({ context });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

router.get('/context', handleGetContext);
router.get('/context/:candidateId', handleGetContext);

export default router;

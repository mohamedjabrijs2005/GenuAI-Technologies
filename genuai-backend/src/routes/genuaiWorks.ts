import express from 'express';
import pool from '../db';
import { DynamicAssessmentEngine } from '../services/dynamicAssessmentEngine';
import { MatchingEngine } from '../services/matchingEngine';

const router = express.Router();

// 1. GET /genuai-works/companies — Get available companies & role options for candidate selection
router.get('/companies', async (_req, res) => {
  try {
    const demoCompanies = [
      {
        id: 101,
        companyName: 'Zoho',
        industry: 'Technology',
        location: 'Chennai, India',
        roles: [
          { id: 1, title: 'Sales Executive', canonicalRole: 'SALES_EXECUTIVE', configStatus: 'locked', version: 1 },
          { id: 2, title: 'Software Developer', canonicalRole: 'SOFTWARE_ENGINEER', configStatus: 'locked', version: 1 },
        ],
      },
      {
        id: 102,
        companyName: 'Apple',
        industry: 'Technology',
        location: 'Cupertino, CA, USA',
        roles: [
          { id: 3, title: 'Software Engineer', canonicalRole: 'SOFTWARE_ENGINEER', configStatus: 'locked', version: 1 },
          { id: 4, title: 'Sales Executive', canonicalRole: 'SALES_EXECUTIVE', configStatus: 'locked', version: 1 },
        ],
      },
      {
        id: 103,
        companyName: 'Google',
        industry: 'Technology',
        location: 'Mountain View, CA, USA',
        roles: [
          { id: 5, title: 'Software Engineer', canonicalRole: 'SOFTWARE_ENGINEER', configStatus: 'locked', version: 1 },
          { id: 6, title: 'Data Analyst', canonicalRole: 'DATA_ANALYST', configStatus: 'locked', version: 1 },
        ],
      },
    ];

    try {
      const dbCompanies = await pool.query(
        `SELECT u.id as company_id, COALESCE(cp.company_name, u.name) as company_name, cp.industry, cp.location
         FROM users u
         LEFT JOIN company_profiles cp ON u.id = cp.user_id
         WHERE u.role = 'company' AND (u.status = 'active' OR u.status IS NULL)`
      );

      if (dbCompanies.rows.length > 0) {
        const resultCompanies = [];
        for (const co of dbCompanies.rows) {
          const rolesRes = await pool.query(
            `SELECT cr.id, cr.title, rt.canonical_name as canonical_role, cac.status as config_status, ccv.version_number
             FROM company_roles cr
             LEFT JOIN role_taxonomy rt ON cr.canonical_role_id = rt.id
             LEFT JOIN company_assessment_configurations cac ON cr.id = cac.company_role_id
             LEFT JOIN company_configuration_versions ccv ON cac.id = ccv.configuration_id AND ccv.status = 'active'
             WHERE cr.company_id = $1`,
            [co.company_id]
          );

          resultCompanies.push({
            id: co.company_id,
            companyName: co.company_name,
            industry: co.industry || 'Technology',
            location: co.location || 'Remote',
            roles: rolesRes.rows.map(r => ({
              id: r.id,
              title: r.title,
              canonicalRole: r.canonical_role || 'GENERAL_ROLE',
              configStatus: r.config_status || 'locked',
              version: r.version_number || 1,
            })),
          });
        }
        return res.json({ companies: resultCompanies });
      }
    } catch (err: any) {
      console.warn('[genuaiWorks] DB companies lookup notice:', err.message);
    }

    res.json({ companies: demoCompanies });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. POST /genuai-works/generate-path — Generate candidate's dynamic assessment path ("I'm Ready" flow)
router.post('/generate-path', async (req, res) => {
  try {
    const { candidateId, selections } = req.body;

    if (!selections || !Array.isArray(selections) || selections.length === 0) {
      return res.status(400).json({ error: 'At least one company and role selection is required.' });
    }

    const pathResult = await DynamicAssessmentEngine.generatePathForCandidate(
      candidateId || 1,
      selections
    );

    res.json({ success: true, path: pathResult });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST /genuai-works/matches — Calculate company match scores for selected companies & roles
router.post('/matches', async (req, res) => {
  try {
    const { candidateId, selections } = req.body;

    if (!selections || !Array.isArray(selections) || selections.length === 0) {
      return res.status(400).json({ error: 'At least one company selection is required to calculate match.' });
    }

    const matchResults = [];
    for (const sel of selections) {
      const match = await MatchingEngine.computeCompanyMatch(
        candidateId || 1,
        sel.companyId,
        sel.roleTitle
      );
      matchResults.push(match);
    }

    res.json({ success: true, matches: matchResults });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

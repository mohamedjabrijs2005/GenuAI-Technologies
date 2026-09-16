import pool from '../db';

export interface CareerTargetItem {
  id: number;
  candidateId: number;
  companyId: number;
  companyName: string;
  industry: string;
  location: string;
  companyRoleId: number;
  roleTitle: string;
  departmentName: string;
  experienceLevel: string;
  isAvailable: boolean;
  availabilityLabel: 'Live Opportunity' | 'Currently unavailable';
  createdAt: string;
}

export interface CandidateCareerContext {
  candidateId: number;
  targets: CareerTargetItem[];
  availableCount: number;
  unavailableCount: number;
  recommendedSkills: {
    technical: string[];
    nonTechnical: string[];
    domain: string[];
    all: string[];
  };
  recommendedModules: {
    id: number;
    name: string;
    canonicalName: string;
    category: string;
  }[];
}

export class CareerContextService {
  /**
   * Retrieves unified personalization context for a candidate based on saved targets.
   * Dynamically calculates live availability against Phase 1 verification status.
   */
  static async getCandidateCareerInterestContext(candidateId: number): Promise<CandidateCareerContext> {
    const context: CandidateCareerContext = {
      candidateId,
      targets: [],
      availableCount: 0,
      unavailableCount: 0,
      recommendedSkills: {
        technical: [],
        nonTechnical: [],
        domain: [],
        all: [],
      },
      recommendedModules: [],
    };

    try {
      // 1. Query candidate's saved targets with live Phase 1 verification & role status
      const targetsRes = await pool.query(
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

      const roleIds: number[] = [];
      const seenRoleIds = new Set<number>();

      for (const row of targetsRes.rows) {
        const isAvailable = Boolean(row.is_available);
        const targetItem: CareerTargetItem = {
          id: row.id,
          candidateId: row.candidate_id,
          companyId: row.company_id,
          companyName: row.company_name,
          industry: row.industry,
          location: row.location,
          companyRoleId: row.company_role_id,
          roleTitle: row.role_title,
          departmentName: row.department_name,
          experienceLevel: row.experience_level,
          isAvailable,
          availabilityLabel: isAvailable ? 'Live Opportunity' : 'Currently unavailable',
          createdAt: row.created_at,
        };

        context.targets.push(targetItem);
        if (isAvailable) {
          context.availableCount++;
        } else {
          context.unavailableCount++;
        }

        if (row.company_role_id && !seenRoleIds.has(row.company_role_id)) {
          seenRoleIds.add(row.company_role_id);
          roleIds.push(row.company_role_id);
        }
      }

      // 2. Aggregate recommended skills from targeted roles
      if (roleIds.length > 0) {
        const skillsRes = await pool.query(
          `SELECT skill_name, category, priority
           FROM company_role_skills
           WHERE company_role_id = ANY($1::int[])
             AND (status IS NULL OR status = 'active')
           ORDER BY (CASE WHEN priority = 'HIGH' THEN 1 WHEN priority = 'MEDIUM' THEN 2 ELSE 3 END) ASC`,
          [roleIds]
        );

        const techSet = new Set<string>();
        const nonTechSet = new Set<string>();
        const domainSet = new Set<string>();

        for (const s of skillsRes.rows) {
          const name = s.skill_name?.trim();
          if (!name) continue;
          if (s.category === 'TECHNICAL') techSet.add(name);
          else if (s.category === 'NON_TECHNICAL') nonTechSet.add(name);
          else if (s.category === 'DOMAIN') domainSet.add(name);
          else techSet.add(name);
        }

        context.recommendedSkills.technical = Array.from(techSet);
        context.recommendedSkills.nonTechnical = Array.from(nonTechSet);
        context.recommendedSkills.domain = Array.from(domainSet);
        context.recommendedSkills.all = Array.from(new Set([...techSet, ...nonTechSet, ...domainSet]));

        // 3. Aggregate recommended assessment modules mapped to targeted roles
        const modulesRes = await pool.query(
          `SELECT DISTINCT am.id, am.name, am.canonical_name, am.category
           FROM company_configuration_requirements ccr
           JOIN company_configuration_versions ccv ON ccr.configuration_version_id = ccv.id AND ccv.status = 'active'
           JOIN company_assessment_configurations cac ON ccv.configuration_id = cac.id
           JOIN assessment_modules am ON ccr.assessment_module_id = am.id
           WHERE cac.company_role_id = ANY($1::int[])`,
          [roleIds]
        );

        context.recommendedModules = modulesRes.rows.map(r => ({
          id: r.id,
          name: r.name,
          canonicalName: r.canonical_name,
          category: r.category,
        }));
      }
    } catch (err: any) {
      console.warn('[CareerContextService] Error building candidate career context:', err.message);
    }

    return context;
  }
}

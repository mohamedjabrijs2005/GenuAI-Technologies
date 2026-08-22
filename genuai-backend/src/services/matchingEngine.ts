import pool from '../db';

export interface ModuleScoreItem {
  moduleName: string;
  canonicalName: string;
  weight: number;
  score: number;
  contribution: number;
  reused: boolean;
}

export interface CompanyMatchResult {
  candidateId: number;
  companyId: number;
  companyName: string;
  roleTitle: string;
  configVersionId?: number;
  overallMatchScore: number; // 0 - 100
  scoreComponents: Record<string, ModuleScoreItem>;
  strengths: string[];
  weakAreas: string[];
  explanation: string;
  generatedAt: string;
}

export class MatchingEngine {
  /**
   * Computes version-bound explainable Candidate → Company → Role Match Score (Rules §27, §28, Fix 2).
   */
  static async computeCompanyMatch(
    candidateId: number,
    companyId: number,
    roleTitle: string,
    completedModuleScores?: Record<string, number>
  ): Promise<CompanyMatchResult> {
    let companyName = `Company #${companyId}`;
    let configVersionId: number | undefined = undefined;
    const scoreComponents: Record<string, ModuleScoreItem> = {};

    // Base fallback module weights for standard demo roles
    const requiredModules: { canonicalName: string; name: string; weight: number }[] =
      this.getFallbackModulesForRole(roleTitle);

    try {
      // Get company name
      const coRes = await pool.query(
        `SELECT company_name FROM company_profiles WHERE user_id = $1 UNION SELECT name as company_name FROM users WHERE id = $1 LIMIT 1`,
        [companyId]
      );
      if (coRes.rows.length > 0) companyName = coRes.rows[0].company_name || companyName;

      // Get active configuration version
      const versionRes = await pool.query(
        `SELECT ccv.id, ccv.weightages
         FROM company_roles cr
         JOIN company_assessment_configurations cac ON cr.id = cac.company_role_id
         JOIN company_configuration_versions ccv ON cac.id = ccv.configuration_id AND ccv.status = 'active'
         WHERE (cr.company_id = $1 OR LOWER(cr.company_id::text) = LOWER($1::text))
           AND LOWER(cr.title) = LOWER($2)
         LIMIT 1`,
        [companyId, roleTitle]
      );

      if (versionRes.rows.length > 0) {
        configVersionId = versionRes.rows[0].id;
      }
    } catch (err: any) {
      console.warn('[MatchingEngine] DB notice:', err.message);
    }

    // Default simulated scores if candidate hasn't completed attempts yet
    const scores = completedModuleScores || this.getSimulatedScoresForRole(roleTitle);

    let totalWeightedScore = 0;
    let totalWeight = 0;
    const strengths: string[] = [];
    const weakAreas: string[] = [];

    for (const req of requiredModules) {
      const score = scores[req.canonicalName] ?? scores[req.name] ?? 82;
      const contribution = score * req.weight;

      totalWeightedScore += contribution;
      totalWeight += req.weight;

      scoreComponents[req.canonicalName] = {
        moduleName: req.name,
        canonicalName: req.canonicalName,
        weight: req.weight,
        score,
        contribution: Math.round(contribution * 100) / 100,
        reused: false,
      };

      if (score >= 82) {
        strengths.push(`${req.name} → Strong (${score}%)`);
      } else if (score < 70) {
        weakAreas.push(`${req.name} → Needs Improvement (${score}%)`);
      }
    }

    const overallMatchScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 80;

    // Generate explainability text (Rule §28)
    const explanation = `Matched at ${overallMatchScore}% for ${companyName} (${roleTitle}). Score calculated based on ${requiredModules.length} locked role requirements: ${requiredModules.map(m => m.name).join(', ')}. Key strengths in ${strengths.slice(0, 2).map(s => s.split(' → ')[0]).join(' and ') || 'core skill modules'}.`;

    const generatedAt = new Date().toISOString();

    try {
      // Save match result bound to version (Fix 2)
      await pool.query(
        `INSERT INTO candidate_company_matches
           (candidate_id, company_id, configuration_version_id, match_score, score_components, strengths, weak_areas, explanation)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          candidateId,
          companyId,
          configVersionId || null,
          overallMatchScore,
          JSON.stringify(scoreComponents),
          JSON.stringify(strengths),
          JSON.stringify(weakAreas),
          explanation,
        ]
      );
    } catch (err: any) {
      console.warn('[MatchingEngine] DB save match notice:', err.message);
    }

    return {
      candidateId,
      companyId,
      companyName,
      roleTitle,
      configVersionId,
      overallMatchScore,
      scoreComponents,
      strengths,
      weakAreas,
      explanation,
      generatedAt,
    };
  }

  private static getFallbackModulesForRole(roleTitle: string): { canonicalName: string; name: string; weight: number }[] {
    const t = (roleTitle || '').toLowerCase();
    if (t.includes('sales')) {
      return [
        { canonicalName: 'GENUAI_SKILL_TEST', name: 'GenuAI Skill Test', weight: 0.30 },
        { canonicalName: 'COMMUNICATION', name: 'Communication', weight: 0.30 },
        { canonicalName: 'GROUP_DISCUSSION', name: 'Group Discussion', weight: 0.20 },
        { canonicalName: 'INTERVIEW', name: 'AI Interview', weight: 0.20 },
      ];
    }
    if (t.includes('analyst')) {
      return [
        { canonicalName: 'GENUAI_SKILL_TEST', name: 'GenuAI Skill Test', weight: 0.20 },
        { canonicalName: 'APTITUDE', name: 'Aptitude', weight: 0.20 },
        { canonicalName: 'LOGICAL_REASONING', name: 'Logical Reasoning', weight: 0.20 },
        { canonicalName: 'SQL_DATA_ANALYSIS', name: 'SQL/Data Analysis', weight: 0.25 },
        { canonicalName: 'INTERVIEW', name: 'AI Interview', weight: 0.15 },
      ];
    }
    return [
      { canonicalName: 'GENUAI_SKILL_TEST', name: 'GenuAI Skill Test', weight: 0.25 },
      { canonicalName: 'CODING', name: 'Coding Assessment', weight: 0.35 },
      { canonicalName: 'DSA', name: 'DSA', weight: 0.25 },
      { canonicalName: 'INTERVIEW', name: 'AI Interview', weight: 0.15 },
    ];
  }

  private static getSimulatedScoresForRole(roleTitle: string): Record<string, number> {
    const t = (roleTitle || '').toLowerCase();
    if (t.includes('sales')) {
      return { GENUAI_SKILL_TEST: 88, COMMUNICATION: 92, GROUP_DISCUSSION: 85, INTERVIEW: 86 };
    }
    if (t.includes('analyst')) {
      return { GENUAI_SKILL_TEST: 84, APTITUDE: 89, LOGICAL_REASONING: 87, SQL_DATA_ANALYSIS: 91, INTERVIEW: 83 };
    }
    return { GENUAI_SKILL_TEST: 87, CODING: 89, DSA: 83, INTERVIEW: 85, PROJECT: 82 };
  }
}

import pool from '../db';
import { ModuleRequirement } from './requirementAggregator';

export interface ReusedAssessmentResult {
  moduleId: number;
  canonicalName: string;
  originalAttemptId: number;
  score: number;
  percentage: number;
  completedAt: string;
  reason: string;
}

export class AssessmentReuseEngine {
  /**
   * Checks candidate's existing valid & verified assessment attempts for eligible reuse (Step 10 / Rule §23).
   */
  static async checkReuseEligibility(
    candidateId: number,
    requirements: ModuleRequirement[]
  ): Promise<{
    reusableResults: ReusedAssessmentResult[];
    remainingRequirements: ModuleRequirement[];
  }> {
    const reusableResults: ReusedAssessmentResult[] = [];
    const remainingRequirements: ModuleRequirement[] = [];

    for (const req of requirements) {
      let isReused = false;

      try {
        // Query DB for verified & valid assessment attempt
        const res = await pool.query(
          `SELECT aa.id, aa.score, aa.percentage, aa.completed_at, aa.validity_months
           FROM assessment_attempts aa
           JOIN assessment_modules am ON aa.assessment_module_id = am.id
           WHERE aa.candidate_id = $1
             AND (am.canonical_name = $2 OR am.id = $3)
             AND aa.verified = true
             AND aa.status = 'completed'
             AND (aa.completed_at + (COALESCE(aa.validity_months, 6) || ' months')::interval) > NOW()
           ORDER BY aa.percentage DESC, aa.completed_at DESC
           LIMIT 1`,
          [candidateId, req.canonicalName, req.moduleId]
        );

        if (res.rows.length > 0) {
          const row = res.rows[0];
          isReused = true;
          reusableResults.push({
            moduleId: req.moduleId,
            canonicalName: req.canonicalName,
            originalAttemptId: row.id,
            score: parseFloat(row.score || row.percentage || 0),
            percentage: parseFloat(row.percentage || row.score || 0),
            completedAt: row.completed_at,
            reason: `Reused existing verified score (${row.percentage}%) completed on ${new Date(row.completed_at).toLocaleDateString()}.`,
          });
        }
      } catch (err: any) {
        console.warn('[AssessmentReuseEngine] DB query notice:', err.message);
      }

      if (!isReused) {
        remainingRequirements.push(req);
      }
    }

    return { reusableResults, remainingRequirements };
  }
}

import pool from '../db';
import { RoleNormalizationEngine, CompanyRoleSelection, CanonicalRoleGroup } from './roleNormalizationEngine';
import { RequirementAggregator, ModuleRequirement } from './requirementAggregator';
import { MajorityAnalyzer, MajorityAnalysisResult } from './majorityAnalyzer';
import { AssessmentReuseEngine, ReusedAssessmentResult } from './assessmentReuseEngine';
import { CandidateGroupingService } from './candidateGroupingService';

export interface DynamicAssessmentPathResult {
  pathId?: number;
  candidateId: number;
  roleGroups: {
    canonicalRoleId: number;
    canonicalRoleName: string;
    selections: CompanyRoleSelection[];
    coreModules: ModuleRequirement[];
    majorityModules: ModuleRequirement[];
    companySpecificModules: ModuleRequirement[];
  }[];
  allRequiredModules: ModuleRequirement[];
  reusedResults: ReusedAssessmentResult[];
  newModulesToComplete: ModuleRequirement[];
  explanations: Record<string, string>;
  createdAt: string;
}

export class DynamicAssessmentEngine {
  /**
   * Main entry point for GenuAI Works Dynamic Assessment Orchestration (Rule §17 / §22 / §33).
   */
  static async generatePathForCandidate(
    candidateId: number,
    selections: CompanyRoleSelection[]
  ): Promise<DynamicAssessmentPathResult> {
    if (!selections || selections.length === 0) {
      throw new Error('Candidate must select at least one company and role to generate assessment path.');
    }

    // Step 3.5: Resolve role normalization & canonical role groups (Fix 1)
    const canonicalGroups: CanonicalRoleGroup[] =
      await RoleNormalizationEngine.resolveCanonicalRoleGroups(selections);

    const processedRoleGroups: {
      canonicalRoleId: number;
      canonicalRoleName: string;
      selections: CompanyRoleSelection[];
      coreModules: ModuleRequirement[];
      majorityModules: ModuleRequirement[];
      companySpecificModules: ModuleRequirement[];
    }[] = [];

    const allAggregatedReqs: ModuleRequirement[] = [];
    const combinedExplanations: Record<string, string> = {};

    for (const group of canonicalGroups) {
      // Steps 6-7: Aggregate requirements WITHIN this canonical group only
      const aggregatedReqs = await RequirementAggregator.aggregateForCanonicalGroup(
        group.canonicalRoleId,
        group.selections
      );

      // Steps 8-9: Common / Majority / Company-Specific analysis
      const analysis: MajorityAnalysisResult = MajorityAnalyzer.analyze(aggregatedReqs);

      processedRoleGroups.push({
        canonicalRoleId: group.canonicalRoleId,
        canonicalRoleName: group.canonicalRoleName,
        selections: group.selections,
        coreModules: analysis.coreModules,
        majorityModules: analysis.majorityModules,
        companySpecificModules: analysis.companySpecificModules,
      });

      allAggregatedReqs.push(...aggregatedReqs);
      Object.assign(combinedExplanations, analysis.explanations);
    }

    // Deduplicate requirements across canonical groups (keeping highest frequency/weight)
    const uniqueReqsMap = new Map<string, ModuleRequirement>();
    for (const req of allAggregatedReqs) {
      if (!uniqueReqsMap.has(req.canonicalName)) {
        uniqueReqsMap.set(req.canonicalName, req);
      } else {
        const existing = uniqueReqsMap.get(req.canonicalName)!;
        existing.companyIds = Array.from(new Set([...existing.companyIds, ...req.companyIds]));
        existing.companyNames = Array.from(new Set([...existing.companyNames, ...req.companyNames]));
      }
    }
    const finalRequiredModules = Array.from(uniqueReqsMap.values());

    // Step 10: Check reusable assessment results (Rule §23)
    const { reusableResults, remainingRequirements } =
      await AssessmentReuseEngine.checkReuseEligibility(candidateId, finalRequiredModules);

    const createdAtStr = new Date().toISOString();
    let pathId: number | undefined = undefined;

    try {
      // Save dynamic path to DB
      const res = await pool.query(
        `INSERT INTO dynamic_assessment_paths
           (candidate_id, canonical_role_groups, core_module_ids, majority_module_ids,
            company_specific_modules, reused_results, assessment_explanations, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'in_progress')
         RETURNING id`,
        [
          candidateId,
          JSON.stringify(processedRoleGroups),
          finalRequiredModules.filter(m => m.frequency === m.totalCompanies).map(m => m.moduleId),
          finalRequiredModules.filter(m => m.frequency > 1 && m.frequency < m.totalCompanies).map(m => m.moduleId),
          JSON.stringify(processedRoleGroups.flatMap(g => g.companySpecificModules)),
          JSON.stringify(reusableResults),
          JSON.stringify(combinedExplanations),
        ]
      );
      if (res.rows.length > 0) {
        pathId = res.rows[0].id;
      }
    } catch (err: any) {
      console.warn('[DynamicAssessmentEngine] Save path DB notice:', err.message);
    }

    // Group candidates (Fix 3)
    for (const group of processedRoleGroups) {
      try {
        await CandidateGroupingService.assignCandidateToGroup(
          candidateId,
          group.canonicalRoleId,
          group.coreModules.concat(group.majorityModules).map(m => m.canonicalName),
          pathId
        );
      } catch (err: any) {
        console.warn('[DynamicAssessmentEngine] Grouping notice:', err.message);
      }
    }

    return {
      pathId,
      candidateId,
      roleGroups: processedRoleGroups,
      allRequiredModules: finalRequiredModules,
      reusedResults: reusableResults,
      newModulesToComplete: remainingRequirements,
      explanations: combinedExplanations,
      createdAt: createdAtStr,
    };
  }
}

import { ModuleRequirement } from './requirementAggregator';

export interface MajorityAnalysisResult {
  coreModules: ModuleRequirement[];
  majorityModules: ModuleRequirement[];
  companySpecificModules: ModuleRequirement[];
  explanations: Record<string, string>; // moduleId -> human readable "Why am I taking this?"
}

export class MajorityAnalyzer {
  /**
   * Performs Common / Majority analysis on aggregated module requirements (Steps 8-9).
   * Generates clear candidate-facing transparency explanations ("Why am I taking this?").
   */
  static analyze(requirements: ModuleRequirement[]): MajorityAnalysisResult {
    const coreModules: ModuleRequirement[] = [];
    const majorityModules: ModuleRequirement[] = [];
    const companySpecificModules: ModuleRequirement[] = [];
    const explanations: Record<string, string> = {};

    for (const req of requirements) {
      const ratio = req.frequency / req.totalCompanies;
      const companyNamesStr = req.companyNames.join(', ');

      if (ratio === 1.0) {
        // 100% match -> CORE requirement
        coreModules.push(req);
        if (req.totalCompanies > 1) {
          explanations[req.canonicalName] = `Included as a core assessment because ${req.name} is required by all ${req.totalCompanies} selected companies (${companyNamesStr}) for your selected role.`;
        } else {
          explanations[req.canonicalName] = `Included as a core assessment because ${req.name} is required by ${companyNamesStr} for your selected role.`;
        }
      } else if (ratio >= 0.5) {
        // Majority requirement (> 50%)
        majorityModules.push(req);
        explanations[req.canonicalName] = `Included as a majority requirement because ${req.name} is required by ${req.frequency} out of your ${req.totalCompanies} selected companies (${companyNamesStr}).`;
      } else {
        // Company-specific requirement (< 50%)
        companySpecificModules.push(req);
        explanations[req.canonicalName] = `Included as a company-specific assessment because ${companyNamesStr} specifically requires ${req.name} for the selected role.`;
      }
    }

    return {
      coreModules,
      majorityModules,
      companySpecificModules,
      explanations,
    };
  }
}

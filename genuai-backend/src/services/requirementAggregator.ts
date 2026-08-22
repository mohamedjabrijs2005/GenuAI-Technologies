import pool from '../db';
import { CompanyRoleSelection } from './roleNormalizationEngine';

export interface ModuleRequirement {
  moduleId: number;
  canonicalName: string;
  name: string;
  category: string;
  companyIds: number[];
  companyNames: string[];
  frequency: number;
  totalCompanies: number;
  weight: number;
}

// Fallback seed configurations when DB is offline/unseeded
const FALLBACK_CONFIGS: Record<string, string[]> = {
  'zoho_sales executive': ['GENUAI_SKILL_TEST', 'COMMUNICATION', 'GROUP_DISCUSSION', 'INTERVIEW'],
  'zoho_software developer': ['GENUAI_SKILL_TEST', 'CODING', 'DSA', 'INTERVIEW'],
  'apple_software engineer': ['GENUAI_SKILL_TEST', 'CODING', 'DSA', 'PROJECT', 'INTERVIEW'],
  'apple_sales executive': ['GENUAI_SKILL_TEST', 'COMMUNICATION', 'GROUP_DISCUSSION', 'INTERVIEW'],
  'google_software engineer': ['GENUAI_SKILL_TEST', 'CODING', 'DSA', 'INTERVIEW'],
  'google_data analyst': ['GENUAI_SKILL_TEST', 'APTITUDE', 'LOGICAL_REASONING', 'SQL_DATA_ANALYSIS', 'INTERVIEW'],
};

export class RequirementAggregator {
  /**
   * Aggregates assessment requirements for a set of selections WITHIN the same canonical role group (Steps 6-9).
   */
  static async aggregateForCanonicalGroup(
    canonicalRoleId: number,
    selections: CompanyRoleSelection[]
  ): Promise<ModuleRequirement[]> {
    const totalCompanies = selections.length;
    const reqMap = new Map<string, {
      moduleId: number;
      canonicalName: string;
      name: string;
      category: string;
      companyIds: Set<number>;
      companyNames: Set<string>;
      weights: number[];
    }>();

    for (const sel of selections) {
      let modulesFound = false;

      try {
        // Query DB for locked configuration version requirements
        const res = await pool.query(
          `SELECT am.id as module_id, am.canonical_name, am.name, am.category, crq.weight
           FROM company_roles cr
           JOIN company_assessment_configurations cac ON cr.id = cac.company_role_id
           JOIN company_configuration_versions ccv ON cac.id = ccv.configuration_id AND ccv.status = 'active'
           JOIN company_configuration_requirements crq ON ccv.id = crq.configuration_version_id
           JOIN assessment_modules am ON crq.assessment_module_id = am.id
           WHERE LOWER(cr.title) = LOWER($1)
             AND (cr.company_id = $2 OR LOWER(cr.company_id::text) = LOWER($2::text))
             AND cac.status = 'locked'`,
          [sel.roleTitle, sel.companyId]
        );

        if (res.rows.length > 0) {
          modulesFound = true;
          for (const row of res.rows) {
            const key = row.canonical_name;
            if (!reqMap.has(key)) {
              reqMap.set(key, {
                moduleId: row.module_id,
                canonicalName: row.canonical_name,
                name: row.name,
                category: row.category,
                companyIds: new Set(),
                companyNames: new Set(),
                weights: [],
              });
            }
            const item = reqMap.get(key)!;
            item.companyIds.add(sel.companyId);
            item.companyNames.add(sel.companyName);
            item.weights.push(parseFloat(row.weight || 1.0));
          }
        }
      } catch (err: any) {
        console.warn('[RequirementAggregator] DB lookup notice:', err.message);
      }

      // Fallback configuration if DB had no locked config for this selection
      if (!modulesFound) {
        const fallbackKey = `${sel.companyName.toLowerCase()}_${sel.roleTitle.toLowerCase()}`;
        const fallbackModules = FALLBACK_CONFIGS[fallbackKey] || this.getGenericFallbackModules(sel.roleTitle);

        for (const modKey of fallbackModules) {
          if (!reqMap.has(modKey)) {
            reqMap.set(modKey, {
              moduleId: this.hashCode(modKey),
              canonicalName: modKey,
              name: this.formatModuleName(modKey),
              category: this.getModuleCategory(modKey),
              companyIds: new Set(),
              companyNames: new Set(),
              weights: [],
            });
          }
          const item = reqMap.get(modKey)!;
          item.companyIds.add(sel.companyId);
          item.companyNames.add(sel.companyName);
          item.weights.push(1.0);
        }
      }
    }

    // Convert map to list with frequency calculations
    const result: ModuleRequirement[] = [];
    for (const [_, val] of reqMap.entries()) {
      const freq = val.companyIds.size;
      const avgWeight = val.weights.reduce((a, b) => a + b, 0) / (val.weights.length || 1);
      result.push({
        moduleId: val.moduleId,
        canonicalName: val.canonicalName,
        name: val.name,
        category: val.category,
        companyIds: Array.from(val.companyIds),
        companyNames: Array.from(val.companyNames),
        frequency: freq,
        totalCompanies,
        weight: avgWeight,
      });
    }

    return result;
  }

  private static getGenericFallbackModules(roleTitle: string): string[] {
    const t = (roleTitle || '').toLowerCase();
    if (t.includes('sales')) {
      return ['GENUAI_SKILL_TEST', 'COMMUNICATION', 'GROUP_DISCUSSION', 'INTERVIEW'];
    }
    if (t.includes('analyst')) {
      return ['GENUAI_SKILL_TEST', 'APTITUDE', 'LOGICAL_REASONING', 'SQL_DATA_ANALYSIS', 'INTERVIEW'];
    }
    return ['GENUAI_SKILL_TEST', 'CODING', 'DSA', 'INTERVIEW'];
  }

  private static formatModuleName(key: string): string {
    const names: Record<string, string> = {
      GENUAI_SKILL_TEST: 'GenuAI Skill Test',
      CODING: 'Coding Assessment',
      DSA: 'DSA',
      PROBLEM_SOLVING: 'Problem Solving',
      COMMUNICATION: 'Communication',
      GROUP_DISCUSSION: 'Group Discussion',
      INTERVIEW: 'AI Interview',
      APTITUDE: 'Aptitude',
      LOGICAL_REASONING: 'Logical Reasoning',
      SQL_DATA_ANALYSIS: 'SQL/Data Analysis',
      PROJECT: 'Project Assessment',
    };
    return names[key] || key.replace(/_/g, ' ');
  }

  private static getModuleCategory(key: string): string {
    if (['COMMUNICATION', 'GROUP_DISCUSSION', 'SVAR'].includes(key)) return 'soft_skill';
    if (['APTITUDE', 'LOGICAL_REASONING'].includes(key)) return 'aptitude';
    if (['INTERVIEW'].includes(key)) return 'interview';
    if (['PROJECT', 'PORTFOLIO'].includes(key)) return 'practical';
    return 'technical';
  }

  private static hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) + 500;
  }
}

import apiClient from './apiClient';

export interface CompanyRoleOption {
  id: number;
  title: string;
  canonicalRole: string;
  configStatus: string;
  version: number;
}

export interface CompanyOption {
  id: number;
  companyName: string;
  industry: string;
  location: string;
  roles: CompanyRoleOption[];
}

export interface CompanyRoleSelectionItem {
  companyId: number;
  companyName: string;
  companyRoleId?: number;
  roleTitle: string;
}

export interface ModuleRequirementItem {
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

export interface DynamicPathData {
  pathId?: number;
  candidateId: number;
  roleGroups: {
    canonicalRoleId: number;
    canonicalRoleName: string;
    selections: CompanyRoleSelectionItem[];
    coreModules: ModuleRequirementItem[];
    majorityModules: ModuleRequirementItem[];
    companySpecificModules: ModuleRequirementItem[];
  }[];
  allRequiredModules: ModuleRequirementItem[];
  reusedResults: {
    moduleId: number;
    canonicalName: string;
    originalAttemptId: number;
    score: number;
    percentage: number;
    completedAt: string;
    reason: string;
  }[];
  newModulesToComplete: ModuleRequirementItem[];
  explanations: Record<string, string>;
  createdAt: string;
}

export interface CompanyMatchScoreItem {
  candidateId: number;
  companyId: number;
  companyName: string;
  roleTitle: string;
  overallMatchScore: number;
  scoreComponents: Record<string, {
    moduleName: string;
    canonicalName: string;
    weight: number;
    score: number;
    contribution: number;
  }>;
  strengths: string[];
  weakAreas: string[];
  explanation: string;
  generatedAt: string;
}

// 1. Fetch available companies and roles
export const getAvailableCompanies = async (): Promise<CompanyOption[]> => {
  try {
    const res = await apiClient.get('/genuai-works/companies');
    return res.data.companies || [];
  } catch (err) {
    console.error('Failed to fetch companies:', err);
    return [];
  }
};

// 1b. Fetch all assessment modules
export const getModules = async (): Promise<any[]> => {
  try {
    const res = await apiClient.get('/modules');
    return res.data.modules || [];
  } catch (err) {
    console.error('Failed to fetch modules:', err);
    return [];
  }
};

// 1c. Fetch role taxonomy
export const getRoleTaxonomy = async (): Promise<any[]> => {
  try {
    const res = await apiClient.get('/roles/taxonomy');
    return res.data.taxonomy || res.data.roles || [];
  } catch (err) {
    console.error('Failed to fetch role taxonomy:', err);
    return [];
  }
};

// 1d. Create company role
export const createCompanyRole = async (data: {
  companyId: number;
  title: string;
  description?: string;
  canonicalRoleId?: number;
}): Promise<any> => {
  const res = await apiClient.post('/company-roles', data);
  return res.data;
};

// 1e. Save draft configuration
export const saveCompanyRoleConfig = async (
  roleId: number,
  data: { companyId: number; modules: number[]; moduleWeights?: Record<number, number> }
): Promise<any> => {
  const res = await apiClient.post(`/company-roles/${roleId}/configuration`, data);
  return res.data;
};

// 1f. Record agreement confirmation
export const agreeCompanyRoleConfig = async (
  roleId: number,
  data: { companyId: number; acceptedBy?: number; ipAddress?: string; agreementText?: string }
): Promise<any> => {
  const res = await apiClient.post(`/company-roles/${roleId}/configuration/agree`, data);
  return res.data;
};

// 1g. Fetch real company candidate matches
export const getCompanyRoleMatches = async (companyId: number | string): Promise<any[]> => {
  try {
    const res = await apiClient.get(`/company-roles/matches/${companyId}`);
    return res.data.matches || [];
  } catch (err) {
    console.error('Failed to fetch company matches:', err);
    return [];
  }
};

// 1h. Fetch candidate match groups & pattern
export const getCandidateMatchGroups = async (candidateId: number | string): Promise<any[]> => {
  try {
    const res = await apiClient.get(`/candidate/match/groups/${candidateId}`);
    return res.data.groups || [];
  } catch (err) {
    console.error('Failed to fetch candidate match groups:', err);
    return [];
  }
};

// 1i. Fetch candidate company matches
export const getCandidateCompanyMatches = async (candidateId: number | string): Promise<any[]> => {
  try {
    const res = await apiClient.get(`/candidate/${candidateId}/company-matches`);
    return res.data.matches || [];
  } catch (err) {
    console.error('Failed to fetch candidate matches:', err);
    return [];
  }
};

// 2. Generate dynamic assessment path ("I'm Ready" flow)
export const generateDynamicPath = async (
  candidateId: number | string,
  selections: CompanyRoleSelectionItem[]
): Promise<DynamicPathData> => {
  const res = await apiClient.post('/genuai-works/generate-path', {
    candidateId: Number(candidateId) || 1,
    selections,
  });
  return res.data.path;
};

// 3. Compute company match scores
export const getCompanyMatches = async (
  candidateId: number | string,
  selections: CompanyRoleSelectionItem[]
): Promise<CompanyMatchScoreItem[]> => {
  const res = await apiClient.post('/genuai-works/matches', {
    candidateId: Number(candidateId) || 1,
    selections,
  });
  return res.data.matches || [];
};

// 4. Save candidate company/role selections
export const saveCandidateSelections = async (
  candidateId: number | string,
  selections: CompanyRoleSelectionItem[]
): Promise<boolean> => {
  const sanitized = sanitizeSelections(selections);
  try {
    await apiClient.post(`/candidate/interests/${candidateId}`, { selections: sanitized });
  } catch (e) {
    console.warn('[genuaiWorks] API save selections fallback:', e);
  }
  localStorage.setItem('genuai_selections', JSON.stringify(sanitized));
  return true;
};

// Helper to sanitize & deduplicate company role selections
export const sanitizeSelections = (list: CompanyRoleSelectionItem[]): CompanyRoleSelectionItem[] => {
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  const valid: CompanyRoleSelectionItem[] = [];

  const isBogusName = (name: string = '') => {
    const l = name.toLowerCase().trim();
    return (
      l.includes('mohamed jabri') ||
      l.includes('demo company') ||
      l.includes('nigga') ||
      l === 'company' ||
      l === 'test' ||
      l === 'test company' ||
      l.length === 0
    );
  };

  for (const item of list) {
    if (!item || isBogusName(item.companyName)) continue;
    const key = `${item.companyName.trim().toLowerCase()}-${(item.roleTitle || '').trim().toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      valid.push({
        companyId: item.companyId,
        companyName: item.companyName.trim(),
        companyRoleId: item.companyRoleId,
        roleTitle: item.roleTitle?.trim() || 'Software Engineer',
      });
    }
  }

  return valid;
};

// 5. Get candidate saved selections with auto-purge of invalid test entries
export const getSavedSelections = (): CompanyRoleSelectionItem[] => {
  try {
    const stored = localStorage.getItem('genuai_selections');
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    const sanitized = sanitizeSelections(parsed);
    if (sanitized.length !== parsed.length) {
      localStorage.setItem('genuai_selections', JSON.stringify(sanitized));
    }
    return sanitized;
  } catch {
    localStorage.removeItem('genuai_selections');
    return [];
  }
};

// 5b. Clear candidate saved selections from storage & backend
export const clearSavedSelections = async (candidateId?: number | string): Promise<void> => {
  try {
    localStorage.removeItem('genuai_selections');
    if (candidateId) {
      await apiClient.delete(`/candidate/interests/${candidateId}`);
    }
  } catch (e) {
    console.warn('[genuaiWorks] Clear selections notice:', e);
  }
};

// 6. Lock company role assessment configuration (Rules §10, §11, §12)
export const lockCompanyRoleConfig = async (
  roleId: number,
  selectedModuleIds: number[],
  acceptedAgreement: boolean,
  companyId: number = 1
): Promise<{ success: boolean; isLocked: boolean; versionId: number; error?: string }> => {
  const res = await apiClient.post(`/company-roles/${roleId}/configuration/lock`, {
    companyId,
    selectedModuleIds,
    acceptedAgreement,
  });
  return res.data;
};

// 7. Request configuration change for locked config (Rule §14)
export const requestConfigChange = async (
  roleId: number,
  reason: string,
  subscriptionId?: number,
  companyId: number = 1
): Promise<{ success: boolean; changeRequest: any }> => {
  const res = await apiClient.post(`/company-roles/${roleId}/configuration/change-request`, {
    companyId,
    reason,
    subscriptionId,
  });
  return res.data;
};

// 8. Fetch subscription plans
export const getSubscriptionPlans = async () => {
  const res = await apiClient.get('/subscriptions/plans');
  return res.data.plans || [];
};

// 9. Admin role equivalency mappings & confirmation (Fix 1 & Fix 5)
export const getRoleEquivalencies = async () => {
  const res = await apiClient.get('/roles/equivalency');
  return res.data.mappings || [];
};

export const confirmRoleEquivalency = async (id: number, canonicalRoleId?: number) => {
  const res = await apiClient.put(`/roles/equivalency/${id}/confirm`, { canonicalRoleId });
  return res.data;
};

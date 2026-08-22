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
  } catch {
    // Fallback static demo data if backend fails
    return [
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
  try {
    await apiClient.post(`/candidate/interests/${candidateId}`, { selections });
    localStorage.setItem('genuai_selections', JSON.stringify(selections));
    return true;
  } catch {
    localStorage.setItem('genuai_selections', JSON.stringify(selections));
    return true;
  }
};

// 5. Get candidate saved selections
export const getSavedSelections = (): CompanyRoleSelectionItem[] => {
  try {
    const stored = localStorage.getItem('genuai_selections');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
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

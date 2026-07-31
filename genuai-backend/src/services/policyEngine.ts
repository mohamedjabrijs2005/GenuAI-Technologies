import { IntegrityPolicyConfig } from '../types/integrity';
import { DEFAULT_INTEGRITY_POLICY } from '../utils/integrityPolicy';

// In-memory store for company-specific integrity policies
const companyPolicies = new Map<number, IntegrityPolicyConfig>();

export class PolicyEngine {
  static getCompanyPolicy(companyId: number): IntegrityPolicyConfig {
    return companyPolicies.get(companyId) || { ...DEFAULT_INTEGRITY_POLICY };
  }

  static setCompanyPolicy(companyId: number, policy: IntegrityPolicyConfig): IntegrityPolicyConfig {
    // Validate weights non-negative
    const validated: IntegrityPolicyConfig = {
      facePresenceWeight: Math.max(0, policy.facePresenceWeight ?? 20),
      voiceConsistencyWeight: Math.max(0, policy.voiceConsistencyWeight ?? 15),
      screenIntegrityWeight: Math.max(0, policy.screenIntegrityWeight ?? 25),
      typingBiometricsWeight: Math.max(0, policy.typingBiometricsWeight ?? 10),
      aiAssistanceWeight: Math.max(0, policy.aiAssistanceWeight ?? 15),
      plagiarismWeight: Math.max(0, policy.plagiarismWeight ?? 15),
      requireConsent: Boolean(policy.requireConsent),
      enableFaceSimilarity: Boolean(policy.enableFaceSimilarity),
    };

    companyPolicies.set(companyId, validated);
    return validated;
  }
}

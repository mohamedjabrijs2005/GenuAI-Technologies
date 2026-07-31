import { IntegrityPolicyConfig, RiskLevel } from '../types/integrity';

export const DEFAULT_INTEGRITY_POLICY: IntegrityPolicyConfig = {
  facePresenceWeight: 20,
  voiceConsistencyWeight: 15,
  screenIntegrityWeight: 25,
  typingBiometricsWeight: 10,
  aiAssistanceWeight: 15,
  plagiarismWeight: 15,
  requireConsent: true,
  enableFaceSimilarity: false,
};

export const calculateRiskLevel = (integrityScore: number): RiskLevel => {
  if (integrityScore >= 80) return 'LOW';
  if (integrityScore >= 60) return 'MEDIUM';
  return 'HIGH';
};

export const generateRecruiterRecommendation = (risk: RiskLevel, score: number): string => {
  switch (risk) {
    case 'LOW':
      return `Candidate demonstrated high assessment integrity (${score}%). Recommended for standard technical evaluation.`;
    case 'MEDIUM':
      return `Moderate risk indicators detected (${score}%). Recruiter review of violation timeline is recommended before proceeding.`;
    case 'HIGH':
      return `Significant integrity risk indicators detected (${score}%). Manual recruiter verification of recorded evidence is required. Final decision rests with the hiring team.`;
  }
};

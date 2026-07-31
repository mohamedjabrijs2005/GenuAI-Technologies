import { IntegrityPolicyConfig, RiskLevel } from '../types/integrity';

export interface IntegrityInputs {
  facePresenceScore: number;       // 0 - 100
  voiceConsistencyScore: number;   // 0 - 100
  screenIntegrityScore: number;    // 0 - 100
  typingBiometricsScore: number;   // 0 - 100
  humanAuthorshipLikelihood: number;// 0 - 100
  plagiarismUniquenessScore: number;// 0 - 100 (100 = completely unique)
}

export const calculateWeightedIntegrityScore = (
  inputs: IntegrityInputs,
  policy: IntegrityPolicyConfig
): number => {
  const totalWeight =
    policy.facePresenceWeight +
    policy.voiceConsistencyWeight +
    policy.screenIntegrityWeight +
    policy.typingBiometricsWeight +
    policy.aiAssistanceWeight +
    policy.plagiarismWeight;

  if (totalWeight === 0) return 85;

  const weightedSum =
    inputs.facePresenceScore * policy.facePresenceWeight +
    inputs.voiceConsistencyScore * policy.voiceConsistencyWeight +
    inputs.screenIntegrityScore * policy.screenIntegrityWeight +
    inputs.typingBiometricsScore * policy.typingBiometricsWeight +
    inputs.humanAuthorshipLikelihood * policy.aiAssistanceWeight +
    inputs.plagiarismUniquenessScore * policy.plagiarismWeight;

  const finalScore = Math.round(weightedSum / totalWeight);
  return Math.max(0, Math.min(100, finalScore));
};

export const classifyRiskLevel = (integrityScore: number): RiskLevel => {
  if (integrityScore >= 80) return 'LOW';
  if (integrityScore >= 60) return 'MEDIUM';
  return 'HIGH';
};

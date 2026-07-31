import { RiskLevel } from '../types/integrity';

export type RecruiterActionRecommendation =
  | 'Proceed'
  | 'Manual Review'
  | 'Additional Technical Interview'
  | 'Additional HR Interview';

export interface RecruiterRecommendationResult {
  primaryAction: RecruiterActionRecommendation;
  secondaryAction?: RecruiterActionRecommendation;
  reasoning: string;
}

export class RecommendationEngine {
  /**
   * Responsible AI Policy:
   * AI NEVER recommends Reject or Hire.
   * AI only recommends Proceed, Manual Review, or Additional Interviews.
   */
  static generateRecommendation(
    riskLevel: RiskLevel,
    integrityScore: number,
    aiAssistanceLikelihood: number,
    plagiarismScore: number
  ): RecruiterRecommendationResult {
    if (riskLevel === 'LOW' && aiAssistanceLikelihood < 30 && plagiarismScore < 15) {
      return {
        primaryAction: 'Proceed',
        reasoning: `High integrity score (${integrityScore}%) with no significant risk indicators. Candidate recommended to proceed in recruitment pipeline.`,
      };
    }

    if (riskLevel === 'HIGH' || plagiarismScore >= 40) {
      return {
        primaryAction: 'Manual Review',
        secondaryAction: 'Additional Technical Interview',
        reasoning: `Significant integrity risk indicators logged (${integrityScore}%). Hiring team should review violation timeline and conduct an additional technical interview.`,
      };
    }

    if (aiAssistanceLikelihood >= 50) {
      return {
        primaryAction: 'Additional Technical Interview',
        secondaryAction: 'Manual Review',
        reasoning: `Moderate AI assistance likelihood detected (${aiAssistanceLikelihood}%). An additional technical interview is recommended to verify conceptual depth.`,
      };
    }

    return {
      primaryAction: 'Manual Review',
      secondaryAction: 'Additional HR Interview',
      reasoning: `Moderate behavioral signals recorded. Recruiter review of the session timeline is advised.`,
    };
  }
}

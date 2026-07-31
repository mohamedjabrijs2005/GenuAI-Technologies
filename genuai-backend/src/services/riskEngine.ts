import {
  IntegrityReport,
  MonitoringEvent,
  IdentityVerificationResult,
} from '../types/integrity';
import { PolicyEngine } from './policyEngine';
import { RecommendationEngine, RecruiterRecommendationResult } from './recommendationEngine';
import { calculateWeightedIntegrityScore, classifyRiskLevel } from '../utils/riskCalculator';
import { generateAIExplanation, StructuredAIExplanation } from '../utils/explanationGenerator';

export interface IntegrityRiskProfilePayload {
  sessionId: string;
  candidateId: number;
  companyId?: number;
  identitySummary: IdentityVerificationResult;
  events: MonitoringEvent[];
  tabSwitches: number;
  copyPasteCount: number;
  typingAbnormal: boolean;
  aiAssistanceLikelihood: number;
  plagiarismScore: number;
}

export interface CompleteIntegrityRiskProfile {
  sessionId: string;
  candidateId: number;
  integrityScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  policyUsed: Record<string, any>;
  identitySummary: IdentityVerificationResult;
  behaviorSummary: {
    tabSwitches: number;
    copyPasteCount: number;
    typingAbnormal: boolean;
    totalEventsCount: number;
  };
  aiAnalysisSummary: {
    aiAssistanceLikelihood: number;
    humanAuthorshipLikelihood: number;
    confidenceScore: number;
  };
  plagiarismSummary: {
    plagiarismScore: number;
    textSimilarity: number;
    codeSimilarity: number;
  };
  explanation: StructuredAIExplanation;
  recommendation: RecruiterRecommendationResult;
  createdAt: string;
}

export class RiskEngine {
  static evaluateRiskProfile(payload: IntegrityRiskProfilePayload): CompleteIntegrityRiskProfile {
    const companyId = payload.companyId || 1;
    const policy = PolicyEngine.getCompanyPolicy(companyId);

    const screenIntegrityScore = Math.max(0, 100 - payload.tabSwitches * 10 - payload.copyPasteCount * 15);
    const typingBiometricsScore = payload.typingAbnormal ? 65 : 95;

    const weightedScore = calculateWeightedIntegrityScore(
      {
        facePresenceScore: payload.identitySummary.facePresenceScore,
        voiceConsistencyScore: payload.identitySummary.voiceConsistencyScore,
        screenIntegrityScore,
        typingBiometricsScore,
        humanAuthorshipLikelihood: 100 - payload.aiAssistanceLikelihood,
        plagiarismUniquenessScore: 100 - payload.plagiarismScore,
      },
      policy
    );

    const riskLevel = classifyRiskLevel(weightedScore);

    const explanation = generateAIExplanation(
      payload.identitySummary.facePresenceScore,
      payload.identitySummary.livenessPassed,
      payload.identitySummary.voiceConsistencyScore,
      payload.tabSwitches,
      payload.copyPasteCount,
      payload.typingAbnormal,
      payload.aiAssistanceLikelihood,
      payload.plagiarismScore,
      riskLevel
    );

    const recommendation = RecommendationEngine.generateRecommendation(
      riskLevel,
      weightedScore,
      payload.aiAssistanceLikelihood,
      payload.plagiarismScore
    );

    return {
      sessionId: payload.sessionId,
      candidateId: payload.candidateId,
      integrityScore: weightedScore,
      riskLevel,
      policyUsed: policy,
      identitySummary: payload.identitySummary,
      behaviorSummary: {
        tabSwitches: payload.tabSwitches,
        copyPasteCount: payload.copyPasteCount,
        typingAbnormal: payload.typingAbnormal,
        totalEventsCount: payload.events.length,
      },
      aiAnalysisSummary: {
        aiAssistanceLikelihood: payload.aiAssistanceLikelihood,
        humanAuthorshipLikelihood: 100 - payload.aiAssistanceLikelihood,
        confidenceScore: 90,
      },
      plagiarismSummary: {
        plagiarismScore: payload.plagiarismScore,
        textSimilarity: payload.plagiarismScore,
        codeSimilarity: Math.round(payload.plagiarismScore * 0.9),
      },
      explanation,
      recommendation,
      createdAt: new Date().toISOString(),
    };
  }
}

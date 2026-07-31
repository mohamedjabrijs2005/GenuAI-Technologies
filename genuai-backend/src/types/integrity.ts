export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface IntegrityPolicyConfig {
  facePresenceWeight: number;
  voiceConsistencyWeight: number;
  screenIntegrityWeight: number;
  typingBiometricsWeight: number;
  aiAssistanceWeight: number;
  plagiarismWeight: number;
  requireConsent: boolean;
  enableFaceSimilarity: boolean;
}

export interface CandidateConsent {
  given: boolean;
  timestamp: string;
  policyVersion: string;
}

export interface IdentityVerificationResult {
  faceVerified: boolean;
  faceMatchScore: number;
  facePresenceScore: number;
  voiceVerified: boolean;
  voiceConsistencyScore: number;
  livenessPassed: boolean;
  livenessResult: 'VERIFIED' | 'UNCERTAIN' | 'FAILED';
  overallConfidence: number;
  verifiedAt?: string;
}

export interface MonitoringEvent {
  id: string;
  sessionId: string;
  candidateId: number;
  type: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  timestamp: string;
  metadata?: Record<string, any>;
  snapshotUrl?: string;
}

export interface TypingBiometricsData {
  wpm: number;
  pauseCount: number;
  burstRatio: number;
  backspaceFrequency: number;
  rhythmVariance: number;
  abnormalFlag: boolean;
}

export interface AIAssistanceAnalysis {
  aiAssistanceLikelihood: number;
  humanAuthorshipLikelihood: number;
  confidenceScore: number;
  stylometricFlags: string[];
}

export interface PlagiarismAnalysis {
  plagiarismScore: number;
  previousCandidateSimilarity: number;
  campaignSimilarity: number;
  codeStructuralSimilarity?: number;
  matchedSourcesCount: number;
}

export interface IntegrityReport {
  sessionId: string;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  assessmentId?: number;
  jobTitle?: string;
  integrityScore: number;
  riskLevel: RiskLevel;
  identitySummary: IdentityVerificationResult;
  screenActivityEventsCount: number;
  events: MonitoringEvent[];
  typingBiometrics: TypingBiometricsData;
  aiAssistance: AIAssistanceAnalysis;
  plagiarism: PlagiarismAnalysis;
  aiExplanation: string;
  recruiterRecommendation: string;
  createdAt: string;
}

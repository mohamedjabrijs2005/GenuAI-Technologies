/**
 * Integrity Module Types — AI Integrity & Identity Verification System
 */

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface IntegrityPolicyConfig {
  facePresenceWeight: number;      // default: 20
  voiceConsistencyWeight: number;  // default: 15
  screenIntegrityWeight: number;   // default: 25
  typingBiometricsWeight: number;  // default: 10
  aiAssistanceWeight: number;      // default: 15
  plagiarismWeight: number;        // default: 15
  requireConsent: boolean;         // default: true
  enableFaceSimilarity: boolean;   // default: false
}

export interface CandidateConsent {
  given: boolean;
  timestamp: string | null;
  policyVersion: string;
}

export interface IdentityVerificationResult {
  faceVerified: boolean;
  faceMatchScore: number;         // 0 - 100 %
  facePresenceScore: number;      // 0 - 100 %
  voiceVerified: boolean;
  voiceConsistencyScore: number;  // 0 - 100 %
  livenessPassed: boolean;
  livenessResult: 'VERIFIED' | 'UNCERTAIN' | 'FAILED';
  overallConfidence: number;      // 0 - 100 %
  verifiedAt?: string;
}

export type MonitoringEventType =
  | 'TAB_SWITCH'
  | 'TAB_HIDDEN'
  | 'TAB_VISIBLE'
  | 'WINDOW_BLUR'
  | 'WINDOW_FOCUS'
  | 'FULLSCREEN_EXIT'
  | 'FULLSCREEN_EXITED'
  | 'FULLSCREEN_ENTERED'
  | 'COPY'
  | 'COPY_EVENT'
  | 'PASTE'
  | 'PASTE_EVENT'
  | 'REFRESH'
  | 'PAGE_REFRESH'
  | 'VISIBILITY_CHANGE'
  | 'IDLE_TIMEOUT'
  | 'IDLE_STARTED'
  | 'IDLE_ENDED'
  | 'RECONNECT'
  | 'SESSION_DISCONNECTED'
  | 'SESSION_RECONNECTED'
  | 'ASSESSMENT_STARTED'
  | 'ASSESSMENT_SUBMITTED'
  | 'FACE_MISSING'
  | 'MULTIPLE_FACES'
  | 'SPEAKER_CHANGE'
  | 'LONG_SILENCE';

export type EventSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface MonitoringEvent {
  id: string;
  sessionId: string;
  candidateId: number;
  type: MonitoringEventType;
  severity: EventSeverity;
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
  aiAssistanceLikelihood: number;  // 0 - 100 %
  humanAuthorshipLikelihood: number;// 0 - 100 %
  confidenceScore: number;         // 0 - 100 %
  stylometricFlags: string[];
}

export interface PlagiarismAnalysis {
  plagiarismScore: number;         // 0 - 100 %
  previousCandidateSimilarity: number;
  campaignSimilarity: number;
  codeStructuralSimilarity?: number;
  matchedSourcesCount: number;
}

export interface IntegrityScoreReport {
  sessionId: string;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  assessmentId?: number;
  jobTitle?: string;

  integrityScore: number;          // 0 - 100
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

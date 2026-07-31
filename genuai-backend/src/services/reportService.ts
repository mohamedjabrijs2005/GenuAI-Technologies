import { IntegrityReport, MonitoringEvent } from '../types/integrity';
import { calculateRiskLevel, generateRecruiterRecommendation } from '../utils/integrityPolicy';

export interface RecruiterHumanDecision {
  sessionId: string;
  candidateId: number;
  recruiterNotes: string;
  decisionStatus: 'Shortlisted' | 'Hold' | 'Rejected' | 'Selected' | 'Pending';
  scheduledNextInterviewAt?: string;
  assignedReviewer?: string;
  finalHRComments?: string;
  updatedAt: string;
}

const recruiterDecisionsStore = new Map<string, RecruiterHumanDecision>();

export class ReportService {
  static async saveRecruiterDecision(decision: RecruiterHumanDecision): Promise<RecruiterHumanDecision> {
    recruiterDecisionsStore.set(decision.sessionId, decision);
    return decision;
  }

  static async getRecruiterDecision(sessionId: string): Promise<RecruiterHumanDecision | null> {
    return recruiterDecisionsStore.get(sessionId) || null;
  }

  static async getDetailedEvidenceReport(sessionId: string): Promise<{
    report: IntegrityReport;
    decision: RecruiterHumanDecision | null;
  }> {
    const mockEvents: MonitoringEvent[] = [
      { id: '1', sessionId, candidateId: 101, type: 'ASSESSMENT_STARTED', severity: 'INFO', timestamp: new Date(Date.now() - 1800000).toISOString() },
      { id: '2', sessionId, candidateId: 101, type: 'TAB_HIDDEN', severity: 'WARNING', timestamp: new Date(Date.now() - 1200000).toISOString() },
      { id: '3', sessionId, candidateId: 101, type: 'TAB_VISIBLE', severity: 'INFO', timestamp: new Date(Date.now() - 1190000).toISOString() },
      { id: '4', sessionId, candidateId: 101, type: 'ASSESSMENT_SUBMITTED', severity: 'INFO', timestamp: new Date().toISOString() },
    ];

    const score = 90;
    const riskLevel = calculateRiskLevel(score);

    const report: IntegrityReport = {
      sessionId,
      candidateId: 101,
      candidateName: 'John Doe',
      candidateEmail: 'candidate@example.com',
      jobTitle: 'Software Engineer',
      assessmentId: 501,
      integrityScore: score,
      riskLevel,
      identitySummary: {
        faceVerified: true,
        faceMatchScore: 94,
        facePresenceScore: 98,
        voiceVerified: true,
        voiceConsistencyScore: 92,
        livenessPassed: true,
        livenessResult: 'VERIFIED',
        overallConfidence: 95,
        verifiedAt: new Date(Date.now() - 1800000).toISOString(),
      },
      screenActivityEventsCount: mockEvents.length,
      events: mockEvents,
      typingBiometrics: {
        wpm: 68,
        pauseCount: 3,
        burstRatio: 0.08,
        backspaceFrequency: 12,
        rhythmVariance: 15,
        abnormalFlag: false,
      },
      aiAssistance: {
        aiAssistanceLikelihood: 14,
        humanAuthorshipLikelihood: 86,
        confidenceScore: 92,
        stylometricFlags: ['Natural sentence variation'],
      },
      plagiarism: {
        plagiarismScore: 4,
        previousCandidateSimilarity: 2,
        campaignSimilarity: 4,
        matchedSourcesCount: 0,
      },
      aiExplanation: 'Candidate maintained high presence and screen integrity. 1 minor tab switch event logged.',
      recruiterRecommendation: generateRecruiterRecommendation(riskLevel, score),
      createdAt: new Date().toISOString(),
    };

    const decision = recruiterDecisionsStore.get(sessionId) || null;
    return { report, decision };
  }
}

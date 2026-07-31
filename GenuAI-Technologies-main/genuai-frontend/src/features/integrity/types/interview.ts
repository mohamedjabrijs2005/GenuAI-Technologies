/**
 * AI Mock Interview & Analysis Engine Types — Phase 4
 */

export interface AnswerEvaluation {
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  overallQuality: number;
  fluencyScore: number;
  grammarScore: number;
  technicalAccuracyReason: string;
  communicationReason: string;
  confidenceReason: string;
  overallExplanation: string;
}

export interface MockInterviewQuestion {
  id: number;
  questionText: string;
  category: 'Technical' | 'Behavioral' | 'SystemDesign' | 'Coding';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Adaptive';
  role: string;
}

export interface InterviewQuestionResponse {
  questionId: number;
  questionText: string;
  candidateVoiceTranscript: string;
  evaluation: AnswerEvaluation;
  aiAssistanceLikelihood: number;
  humanAuthorshipLikelihood: number;
  voiceConsistencyScore: number;
  facePresenceStatus: string;
  timestamp: string;
}

export interface InterviewTimelineEvent {
  time: string;
  title: string;
  description?: string;
  type: 'INFO' | 'QUESTION' | 'ANSWER' | 'MONITORING' | 'EVALUATION';
}

export interface InterviewSessionSummary {
  sessionId: string;
  candidateId: number;
  role: string;
  startTime: string;
  endTime: string;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  aiAssistanceLikelihood: number;
  humanAuthorshipLikelihood: number;
  voiceConsistencyScore: number;
  facePresenceSummary: {
    facePresentPercentage: number;
    faceMissingCount: number;
    multipleFacesCount: number;
  };
  timeline: InterviewTimelineEvent[];
  responses: InterviewQuestionResponse[];
}

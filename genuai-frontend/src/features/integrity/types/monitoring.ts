import type { EventSeverity } from './index';
export type { EventSeverity };

export type ScreenEventType =
  | 'ASSESSMENT_STARTED'
  | 'ASSESSMENT_SUBMITTED'
  | 'TAB_HIDDEN'
  | 'TAB_VISIBLE'
  | 'WINDOW_BLUR'
  | 'WINDOW_FOCUS'
  | 'FULLSCREEN_EXITED'
  | 'FULLSCREEN_ENTERED'
  | 'COPY_EVENT'
  | 'PASTE_EVENT'
  | 'PAGE_REFRESH'
  | 'NAVIGATION_ATTEMPT'
  | 'IDLE_STARTED'
  | 'IDLE_ENDED'
  | 'SESSION_DISCONNECTED'
  | 'SESSION_RECONNECTED';

export interface ScreenIntegrityEvent {
  id: string;
  sessionId: string;
  candidateId: number;
  type: ScreenEventType;
  severity: EventSeverity;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface TypingMetrics {
  wpm: number;
  averageKeystrokeIntervalMs: number;
  pauseCount: number;             // Pauses > 2000ms
  backspaceFrequency: number;
  burstTypingCount: number;       // Fast bursts > 120 WPM
  rhythmVariance: number;
  totalKeystrokes: number;
}

export interface QuestionInteractionEvent {
  questionId: number | string;
  questionOpenedAt: string;
  firstKeypressAt?: string;
  firstAnswerSubmittedAt?: string;
  answerEditedCount: number;
  timeSpentSeconds: number;
  finalSubmittedAt?: string;
}

export interface AssessmentSessionSummary {
  sessionId: string;
  candidateId: number;
  startTime: string;
  endTime?: string;
  totalActiveTimeSeconds: number;
  totalIdleTimeSeconds: number;
  tabSwitchCount: number;
  focusLossCount: number;
  copyCount: number;
  pasteCount: number;
  refreshCount: number;
  fullscreenExitCount: number;
  reconnectCount: number;
  eventsTimeline: ScreenIntegrityEvent[];
  questionTimelines: Record<string, QuestionInteractionEvent>;
  typingMetrics: TypingMetrics;
}

/**
 * Integrity Monitor Service — handles screen integrity event streaming & session summaries
 */
import apiClient from '../../../services/apiClient';
import type { ScreenIntegrityEvent, AssessmentSessionSummary } from '../types/monitoring';

export const streamScreenEvent = async (event: ScreenIntegrityEvent): Promise<boolean> => {
  try {
    await apiClient.post('/integrity/log-event', {
      sessionId: event.sessionId,
      candidateId: event.candidateId,
      type: event.type,
      severity: event.severity,
      timestamp: event.timestamp,
      metadata: event.metadata,
    });
    return true;
  } catch {
    return false;
  }
};

export const submitSessionSummary = async (summary: AssessmentSessionSummary): Promise<boolean> => {
  try {
    await apiClient.post('/integrity/session-summary', summary);
    return true;
  } catch {
    return false;
  }
};

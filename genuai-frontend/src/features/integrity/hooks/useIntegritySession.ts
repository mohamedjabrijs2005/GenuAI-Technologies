/**
 * Hook to manage active integrity monitoring session state
 */
import { useState, useCallback } from 'react';
import type { CandidateConsent, IdentityVerificationResult, MonitoringEvent } from '../types';
import { logMonitoringEvent } from '../services/integrityClient';

export const useIntegritySession = (candidateId: number, initialSessionId?: string) => {
  const [sessionId] = useState<string>(
    initialSessionId || `session-${candidateId}-${Date.now()}`
  );
  const [consent, setConsent] = useState<CandidateConsent>({
    given: false,
    timestamp: null,
    policyVersion: '1.0',
  });
  const [identityResult, setIdentityResult] = useState<IdentityVerificationResult | null>(null);
  const [events, setEvents] = useState<MonitoringEvent[]>([]);

  const recordEvent = useCallback(
    async (type: MonitoringEvent['type'], severity: MonitoringEvent['severity'], metadata?: Record<string, any>) => {
      const newEvent: Partial<MonitoringEvent> = {
        sessionId,
        candidateId,
        type,
        severity,
        timestamp: new Date().toISOString(),
        metadata,
      };

      try {
        await logMonitoringEvent(newEvent);
      } catch (err) {
        // Silently log monitoring event failures
      }

      setEvents((prev) => [
        ...prev,
        { ...newEvent, id: `evt-${Date.now()}-${Math.random()}` } as MonitoringEvent,
      ]);
    },
    [sessionId, candidateId]
  );

  return {
    sessionId,
    consent,
    setConsent,
    identityResult,
    setIdentityResult,
    events,
    recordEvent,
  };
};

/**
 * useIntegritySession — React hook for managing an integrity monitoring session.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  startIntegrityMonitor,
  stopIntegrityMonitor,
  subscribeToMonitor,
} from '../services/integrityMonitorService';
import type { MonitorState } from '../types/monitoring';

export function useIntegritySession(autoStart = false) {
  const [monitorState, setMonitorState] = useState<MonitorState>({
    isActive: false,
    events: [],
    lastChecked: new Date().toISOString(),
  });

  useEffect(() => {
    const unsubscribe = subscribeToMonitor(setMonitorState);
    if (autoStart) startIntegrityMonitor();
    return () => {
      unsubscribe();
      stopIntegrityMonitor();
    };
  }, [autoStart]);

  const start = useCallback(() => startIntegrityMonitor(), []);
  const stop = useCallback(() => stopIntegrityMonitor(), []);

  return { monitorState, start, stop };
}

/**
 * useScreenIntegrity — detects tab switches and visibility changes.
 */
import { useState, useEffect } from 'react';
import { recordMonitorEvent } from '../services/integrityMonitorService';

export interface ScreenIntegrityState {
  tabSwitchCount: number;
  isVisible: boolean;
}

export function useScreenIntegrity(enabled = true): ScreenIntegrityState {
  const [state, setState] = useState<ScreenIntegrityState>({
    tabSwitchCount: 0,
    isVisible: !document.hidden,
  });

  useEffect(() => {
    if (!enabled) return;

    const handleVisibility = () => {
      const isVisible = !document.hidden;
      if (!isVisible) {
        recordMonitorEvent('tab_switch');
        setState((prev) => ({
          tabSwitchCount: prev.tabSwitchCount + 1,
          isVisible,
        }));
      } else {
        setState((prev) => ({ ...prev, isVisible }));
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [enabled]);

  return state;
}

/**
 * useTypingBiometrics — tracks keystroke dynamics for integrity analysis.
 */
import { useState, useRef, useCallback } from 'react';

export interface TypingBiometricsState {
  avgKeystrokeInterval: number; // ms
  totalKeystrokes: number;
  burstCount: number;
}

export function useTypingBiometrics() {
  const lastKeyTime = useRef<number | null>(null);
  const intervals = useRef<number[]>([]);

  const [state, setState] = useState<TypingBiometricsState>({
    avgKeystrokeInterval: 0,
    totalKeystrokes: 0,
    burstCount: 0,
  });

  const handleKeyDown = useCallback(() => {
    const now = Date.now();
    if (lastKeyTime.current !== null) {
      const interval = now - lastKeyTime.current;
      intervals.current.push(interval);

      const avg =
        intervals.current.reduce((a, b) => a + b, 0) / intervals.current.length;

      // Burst: more than 5 keys in under 200 ms average
      const recentBurst = intervals.current.slice(-5).every((i) => i < 100);

      setState((prev) => ({
        avgKeystrokeInterval: Math.round(avg),
        totalKeystrokes: prev.totalKeystrokes + 1,
        burstCount: recentBurst ? prev.burstCount + 1 : prev.burstCount,
      }));
    }
    lastKeyTime.current = now;
  }, []);

  const reset = useCallback(() => {
    lastKeyTime.current = null;
    intervals.current = [];
    setState({ avgKeystrokeInterval: 0, totalKeystrokes: 0, burstCount: 0 });
  }, []);

  return { ...state, handleKeyDown, reset };
}

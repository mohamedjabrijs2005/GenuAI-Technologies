/**
 * Hook for privacy-friendly Typing Biometrics (WPM, Flight/Dwell Interval, Burst Typing)
 * NOTE: Raw keystrokes are NEVER recorded. Only aggregated timestamps & character counts are processed.
 */
import { useState, useRef, useCallback } from 'react';
import type { TypingMetrics } from '../types/monitoring';

export const useTypingBiometrics = () => {
  const [metrics, setMetrics] = useState<TypingMetrics>({
    wpm: 0,
    averageKeystrokeIntervalMs: 0,
    pauseCount: 0,
    backspaceFrequency: 0,
    burstTypingCount: 0,
    rhythmVariance: 0,
    totalKeystrokes: 0,
  });

  const lastKeyTimeRef = useRef<number>(0);
  const intervalsRef = useRef<number[]>([]);
  const pauseCountRef = useRef<number>(0);
  const backspaceCountRef = useRef<number>(0);
  const burstCountRef = useRef<number>(0);
  const totalKeystrokesRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const handleKeystroke = useCallback((keyEvent?: React.KeyboardEvent | KeyboardEvent) => {
    const now = Date.now();
    if (!startTimeRef.current) startTimeRef.current = now;

    totalKeystrokesRef.current += 1;

    if (keyEvent && (keyEvent.key === 'Backspace' || keyEvent.key === 'Delete')) {
      backspaceCountRef.current += 1;
    }

    if (lastKeyTimeRef.current > 0) {
      const interval = now - lastKeyTimeRef.current;

      // Filter extreme gaps
      if (interval > 2000) {
        pauseCountRef.current += 1;
      } else if (interval < 50) {
        burstCountRef.current += 1;
      } else {
        intervalsRef.current.push(interval);
      }

      // Limit buffer size to last 50 intervals
      if (intervalsRef.current.length > 50) {
        intervalsRef.current.shift();
      }

      // Calculate aggregate metrics
      const totalTimeSec = Math.max(1, (now - startTimeRef.current) / 1000);
      const wpm = Math.round((totalKeystrokesRef.current / 5) / (totalTimeSec / 60));

      const avgInterval = intervalsRef.current.length > 0
        ? Math.round(intervalsRef.current.reduce((a, b) => a + b, 0) / intervalsRef.current.length)
        : 0;

      const variance = intervalsRef.current.length > 1
        ? Math.round(intervalsRef.current.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / intervalsRef.current.length)
        : 0;

      setMetrics({
        wpm,
        averageKeystrokeIntervalMs: avgInterval,
        pauseCount: pauseCountRef.current,
        backspaceFrequency: backspaceCountRef.current,
        burstTypingCount: burstCountRef.current,
        rhythmVariance: Math.min(100, Math.round(Math.sqrt(variance))),
        totalKeystrokes: totalKeystrokesRef.current,
      });
    }

    lastKeyTimeRef.current = now;
  }, []);

  const resetMetrics = useCallback(() => {
    lastKeyTimeRef.current = 0;
    intervalsRef.current = [];
    pauseCountRef.current = 0;
    backspaceCountRef.current = 0;
    burstCountRef.current = 0;
    totalKeystrokesRef.current = 0;
    startTimeRef.current = 0;
    setMetrics({
      wpm: 0,
      averageKeystrokeIntervalMs: 0,
      pauseCount: 0,
      backspaceFrequency: 0,
      burstTypingCount: 0,
      rhythmVariance: 0,
      totalKeystrokes: 0,
    });
  }, []);

  return { metrics, handleKeystroke, resetMetrics };
};

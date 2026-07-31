/**
 * useTimer — countdown timer hook.
 * @param initialSeconds - starting value in seconds
 * @returns { timeLeft, isRunning, start, pause, reset, fmt }
 */
import { useState, useRef, useCallback, useEffect } from 'react';

export const useTimer = (initialSeconds: number) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<any>(null);

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [isRunning]);

  const pause = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  }, []);

  const reset = useCallback((seconds?: number) => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeLeft(seconds ?? initialSeconds);
  }, [initialSeconds]);

  // Cleanup on unmount
  useEffect(() => () => clearInterval(intervalRef.current), []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return { timeLeft, isRunning, start, pause, reset, fmt };
};

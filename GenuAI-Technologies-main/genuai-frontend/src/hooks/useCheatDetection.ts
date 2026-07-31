/**
 * useCheatDetection — malpractice monitoring for proctored assessments.
 * Handles tab visibility, copy/paste, context menu, fullscreen events.
 */
import { useState, useCallback, useEffect } from 'react';

interface UseCheatDetectionReturn {
  cheatCount: number;
  cheatWarning: string;
  clearWarning: () => void;
}

export const useCheatDetection = (isActive: boolean): UseCheatDetectionReturn => {
  const [cheatCount, setCheatCount] = useState(0);
  const [cheatWarning, setCheatWarning] = useState('');

  const warn = useCallback((message: string) => {
    setCheatCount(c => c + 1);
    setCheatWarning(message);
    setTimeout(() => setCheatWarning(''), 3000);
  }, []);

  const clearWarning = useCallback(() => setCheatWarning(''), []);

  useEffect(() => {
    if (!isActive) return;

    // Enter fullscreen
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});

    const onHide = () => {
      if (document.hidden) warn('Tab switch detected! -10 points penalty.');
    };
    const onCopy = (e: Event) => {
      e.preventDefault();
      warn('Copy detected! This is logged.');
    };
    const onRC = (e: Event) => {
      e.preventDefault();
      warn('Right-click disabled during test!');
    };

    document.addEventListener('visibilitychange', onHide);
    document.addEventListener('copy', onCopy);
    document.addEventListener('contextmenu', onRC);

    return () => {
      document.removeEventListener('visibilitychange', onHide);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('contextmenu', onRC);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, [isActive, warn]);

  return { cheatCount, cheatWarning, clearWarning };
};

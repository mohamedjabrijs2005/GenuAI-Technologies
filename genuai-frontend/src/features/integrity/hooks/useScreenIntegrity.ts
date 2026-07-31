/**
 * Hook for reliable, browser-compatible Screen Integrity Monitoring & Timeline tracking
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  ScreenIntegrityEvent,
  ScreenEventType,
  EventSeverity,
  AssessmentSessionSummary,
  QuestionInteractionEvent,
} from '../types/monitoring';
import { streamScreenEvent } from '../services/integrityMonitorService';

export const useScreenIntegrity = (sessionId: string, candidateId: number, active: boolean) => {
  const [timeline, setTimeline] = useState<ScreenIntegrityEvent[]>([]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [focusLossCount, setFocusLossCount] = useState(0);
  const [copyCount, setCopyCount] = useState(0);
  const [pasteCount, setPasteCount] = useState(0);
  const [refreshCount, setRefreshCount] = useState(0);
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0);
  const [reconnectCount, setReconnectCount] = useState(0);
  const [isIdle, setIsIdle] = useState(false);

  const activeStartTime = useRef<number>(Date.now());
  const idleSecondsRef = useRef<number>(0);
  const idleTimerRef = useRef<any>(null);
  const questionTimelinesRef = useRef<Record<string, QuestionInteractionEvent>>({});

  const emitEvent = useCallback(
    (type: ScreenEventType, severity: EventSeverity, metadata?: Record<string, any>) => {
      const evt: ScreenIntegrityEvent = {
        id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        sessionId,
        candidateId,
        type,
        severity,
        timestamp: new Date().toISOString(),
        metadata,
      };

      setTimeline((prev) => [...prev, evt]);
      streamScreenEvent(evt);
    },
    [sessionId, candidateId]
  );

  // Setup Event Listeners
  useEffect(() => {
    if (!active) return;

    emitEvent('ASSESSMENT_STARTED', 'INFO', { userAgent: navigator.userAgent });

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((c) => c + 1);
        emitEvent('TAB_HIDDEN', 'WARNING', { hiddenAt: new Date().toISOString() });
      } else {
        emitEvent('TAB_VISIBLE', 'INFO');
      }
    };

    const handleBlur = () => {
      setFocusLossCount((c) => c + 1);
      emitEvent('WINDOW_BLUR', 'WARNING');
    };

    const handleFocus = () => {
      emitEvent('WINDOW_FOCUS', 'INFO');
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullscreenExitCount((c) => c + 1);
        emitEvent('FULLSCREEN_EXITED', 'WARNING');
      } else {
        emitEvent('FULLSCREEN_ENTERED', 'INFO');
      }
    };

    const handleCopy = () => {
      setCopyCount((c) => c + 1);
      emitEvent('COPY_EVENT', 'WARNING');
    };

    const handlePaste = () => {
      setPasteCount((c) => c + 1);
      emitEvent('PASTE_EVENT', 'WARNING');
    };

    const handleBeforeUnload = () => {
      setRefreshCount((c) => c + 1);
      emitEvent('PAGE_REFRESH', 'CRITICAL');
    };

    const handleOffline = () => {
      emitEvent('SESSION_DISCONNECTED', 'CRITICAL');
    };

    const handleOnline = () => {
      setReconnectCount((c) => c + 1);
      emitEvent('SESSION_RECONNECTED', 'INFO');
    };

    // Idle Detection (No mouse/key activity for 45s)
    const resetIdleTimer = () => {
      if (idleSecondsRef.current > 45) {
        setIsIdle(false);
        emitEvent('IDLE_ENDED', 'INFO');
      }
      idleSecondsRef.current = 0;
    };

    idleTimerRef.current = setInterval(() => {
      idleSecondsRef.current += 1;
      if (idleSecondsRef.current === 45) {
        setIsIdle(true);
        emitEvent('IDLE_STARTED', 'WARNING', { idleThreshold: '45s' });
      }
    }, 1000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      clearInterval(idleTimerRef.current);
    };
  }, [active, emitEvent]);

  // Question Interaction Tracking
  const trackQuestionOpen = useCallback((questionId: string | number) => {
    const key = String(questionId);
    if (!questionTimelinesRef.current[key]) {
      questionTimelinesRef.current[key] = {
        questionId,
        questionOpenedAt: new Date().toISOString(),
        answerEditedCount: 0,
        timeSpentSeconds: 0,
      };
    }
  }, []);

  const trackQuestionKeypress = useCallback((questionId: string | number) => {
    const key = String(questionId);
    const item = questionTimelinesRef.current[key];
    if (item) {
      if (!item.firstKeypressAt) {
        item.firstKeypressAt = new Date().toISOString();
      }
      item.answerEditedCount += 1;
    }
  }, []);

  const trackQuestionSubmit = useCallback((questionId: string | number) => {
    const key = String(questionId);
    const item = questionTimelinesRef.current[key];
    if (item) {
      const now = new Date().toISOString();
      if (!item.firstAnswerSubmittedAt) {
        item.firstAnswerSubmittedAt = now;
      }
      item.finalSubmittedAt = now;
      const opened = new Date(item.questionOpenedAt).getTime();
      item.timeSpentSeconds = Math.round((Date.now() - opened) / 1000);
    }
  }, []);

  const getSessionSummary = useCallback((): Partial<AssessmentSessionSummary> => {
    const totalActiveTime = Math.round((Date.now() - activeStartTime.current) / 1000);
    return {
      sessionId,
      candidateId,
      startTime: new Date(activeStartTime.current).toISOString(),
      endTime: new Date().toISOString(),
      totalActiveTimeSeconds: totalActiveTime,
      totalIdleTimeSeconds: idleSecondsRef.current,
      tabSwitchCount,
      focusLossCount,
      copyCount,
      pasteCount,
      refreshCount,
      fullscreenExitCount,
      reconnectCount,
      eventsTimeline: timeline,
      questionTimelines: questionTimelinesRef.current,
    };
  }, [
    sessionId,
    candidateId,
    tabSwitchCount,
    focusLossCount,
    copyCount,
    pasteCount,
    refreshCount,
    fullscreenExitCount,
    reconnectCount,
    timeline,
  ]);

  return {
    timeline,
    tabSwitchCount,
    focusLossCount,
    copyCount,
    pasteCount,
    refreshCount,
    fullscreenExitCount,
    reconnectCount,
    isIdle,
    trackQuestionOpen,
    trackQuestionKeypress,
    trackQuestionSubmit,
    getSessionSummary,
  };
};

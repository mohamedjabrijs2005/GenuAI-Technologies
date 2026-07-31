/**
 * useMediaRecorder — audio and video recording state management.
 * Encapsulates MediaRecorder lifecycle so it doesn't live in page components.
 */
import { useState, useRef, useCallback } from 'react';

export type RecordingMode = 'idle' | 'recording' | 'recorded';

interface UseMediaRecorderReturn {
  isRecording: boolean;
  audioBlob: Blob | null;
  videoBlob: Blob | null;
  videoMode: RecordingMode;
  recTimer: number;
  startAudioRecording: () => Promise<void>;
  stopAudioRecording: () => void;
  startVideoRecording: (previewVideoEl: HTMLVideoElement) => Promise<void>;
  stopVideoRecording: () => void;
  resetRecording: () => void;
  mediaRef: React.MutableRefObject<MediaRecorder | null>;
}

export const useMediaRecorder = (): UseMediaRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoMode, setVideoMode] = useState<RecordingMode>('idle');
  const [recTimer, setRecTimer] = useState(0);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<any>(null);

  const startAudioRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      const chunks: BlobPart[] = [];
      mr.ondataavailable = (e) => chunks.push(e.data);
      mr.onstop = () => setAudioBlob(new Blob(chunks, { type: 'audio/webm' }));
      mr.start();
      setIsRecording(true);
      setRecTimer(0);
      timerRef.current = setInterval(() => setRecTimer(t => t + 1), 1000);
    } catch {
      // Microphone unavailable — handled by caller
    }
  }, []);

  const stopAudioRecording = useCallback(() => {
    mediaRef.current?.stop();
    setIsRecording(false);
    clearInterval(timerRef.current);
  }, []);

  const startVideoRecording = useCallback(async (previewVideoEl: HTMLVideoElement) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      previewVideoEl.srcObject = stream;
      previewVideoEl.muted = true;
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      const chunks: BlobPart[] = [];
      mr.ondataavailable = (e: BlobEvent) => chunks.push(e.data);
      mr.onstop = () => {
        setVideoBlob(new Blob(chunks, { type: 'video/webm' }));
        stream.getTracks().forEach((t: MediaStreamTrack) => t.stop());
      };
      mr.start();
      setVideoMode('recording');
      setRecTimer(0);
      timerRef.current = setInterval(() => setRecTimer(t => t + 1), 1000);
    } catch {
      throw new Error('Camera/mic access required');
    }
  }, []);

  const stopVideoRecording = useCallback(() => {
    mediaRef.current?.stop();
    clearInterval(timerRef.current);
    setVideoMode('recorded');
  }, []);

  const resetRecording = useCallback(() => {
    setVideoMode('idle');
    setVideoBlob(null);
    setAudioBlob(null);
    setRecTimer(0);
  }, []);

  return {
    isRecording,
    audioBlob,
    videoBlob,
    videoMode,
    recTimer,
    startAudioRecording,
    stopAudioRecording,
    startVideoRecording,
    stopVideoRecording,
    resetRecording,
    mediaRef,
  };
};

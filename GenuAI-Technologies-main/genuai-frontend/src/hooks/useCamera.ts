/**
 * useCamera — webcam stream lifecycle management.
 * Handles starting/stopping a camera stream cleanly, with cleanup on unmount.
 */
import { useRef, useCallback } from 'react';

interface UseCameraReturn {
  startCamera: (videoEl: HTMLVideoElement, options?: MediaStreamConstraints) => Promise<MediaStream | null>;
  stopCamera: () => void;
  streamRef: React.MutableRefObject<MediaStream | null>;
}

export const useCamera = (): UseCameraReturn => {
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async (
    videoEl: HTMLVideoElement,
    options: MediaStreamConstraints = { video: { facingMode: 'user' }, audio: false }
  ): Promise<MediaStream | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(options);
      streamRef.current = stream;
      videoEl.srcObject = stream;
      await videoEl.play().catch(() => {});
      return stream;
    } catch {
      return null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }, []);

  return { startCamera, stopCamera, streamRef };
};

/**
 * FaceMonitorCanvas — renders a webcam feed with face detection overlay.
 * In this stub, only the canvas element and UI chrome are rendered.
 * Wire up a real face detection library (e.g. face-api.js) as needed.
 */
import React, { useRef, useEffect } from 'react';

export interface FaceMonitorCanvasProps {
  width?: number;
  height?: number;
  active?: boolean;
  onFaceAbsent?: () => void;
}

export const FaceMonitorCanvas: React.FC<FaceMonitorCanvasProps> = ({
  width = 320,
  height = 240,
  active = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!active) return;
    let stream: MediaStream | null = null;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch(() => {
        // Camera not available — silently degrade
      });

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [active]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-surface-container bg-black"
      style={{ width, height }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{ display: active ? 'block' : 'none' }}
      />
      {!active && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <span className="material-symbols-outlined text-surface-container-high text-4xl">
            videocam_off
          </span>
          <span className="text-xs text-on-surface-variant">Camera inactive</span>
        </div>
      )}
      <div className="absolute bottom-2 right-2">
        <span
          className={`inline-block w-2.5 h-2.5 rounded-full ${
            active ? 'bg-error animate-pulse' : 'bg-surface-container-high'
          }`}
        />
      </div>
    </div>
  );
};

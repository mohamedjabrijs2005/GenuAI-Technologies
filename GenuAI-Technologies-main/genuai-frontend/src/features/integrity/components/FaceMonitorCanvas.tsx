import React, { useEffect, useRef, useState } from 'react';

interface Props {
  onFaceStatusChange: (status: 'FACE_PRESENT' | 'NO_FACE' | 'MULTIPLE_FACES') => void;
  active: boolean;
}

export const FaceMonitorCanvas: React.FC<Props> = ({ onFaceStatusChange, active }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const lastStatusRef = useRef<'FACE_PRESENT' | 'NO_FACE' | 'MULTIPLE_FACES'>('FACE_PRESENT');

  useEffect(() => {
    if (!active) {
      stream?.getTracks().forEach((t) => t.stop());
      return;
    }

    let isMounted = true;

    const initCam = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 }, audio: false });
        if (!isMounted) return;
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch {
        // Camera unavailable or denied
      }
    };

    initCam();

    return () => {
      isMounted = false;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [active]);

  // Periodic pixel intensity analysis to verify presence
  useEffect(() => {
    if (!active || !stream) return;

    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 160;
      canvas.height = 120;
      ctx.drawImage(video, 0, 0, 160, 120);

      const frame = ctx.getImageData(0, 0, 160, 120);
      const data = frame.data;

      // Estimate skin color / pixel luminance variation across middle frame area
      let skinPixels = 0;
      let totalSampled = 0;

      for (let i = 0; i < data.length; i += 16) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        totalSampled++;

        // Skin tone heuristic check in RGB
        if (r > 60 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15) {
          skinPixels++;
        }
      }

      const ratio = skinPixels / totalSampled;
      let newStatus: 'FACE_PRESENT' | 'NO_FACE' | 'MULTIPLE_FACES' = 'FACE_PRESENT';

      if (ratio < 0.05) {
        newStatus = 'NO_FACE';
      } else if (ratio > 0.65) {
        newStatus = 'MULTIPLE_FACES';
      } else {
        newStatus = 'FACE_PRESENT';
      }

      if (newStatus !== lastStatusRef.current) {
        lastStatusRef.current = newStatus;
        onFaceStatusChange(newStatus);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [active, stream, onFaceStatusChange]);

  if (!active) return null;

  return (
    <div className="relative w-32 h-24 bg-black rounded-lg overflow-hidden border border-surface-container shadow-sm">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-sm text-[9px] font-bold text-success px-1.5 py-0.5 rounded flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
        <span>FACE ON</span>
      </div>
    </div>
  );
};

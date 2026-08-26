import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const GenuAILogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  // Use state to gracefully fall back from PNG to SVG to inline vector shield
  const [srcIndex, setSrcIndex] = useState(0);
  const sources = ['/logo.png', '/logo.svg', '/logo-shield.png'];

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const dimClass = sizeClasses[size] || sizeClasses.md;

  const handleImgError = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex((prev) => prev + 1);
    } else {
      setSrcIndex(999); // trigger inline SVG shield fallback
    }
  };

  return (
    <div className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
      <div className={`relative ${dimClass} shrink-0 flex items-center justify-center`}>
        {srcIndex < sources.length ? (
          <img
            src={sources[srcIndex]}
            alt="GenuAI Technologies"
            className="w-full h-full object-contain drop-shadow-xs transition-transform duration-300 hover:scale-105"
            onError={handleImgError}
          />
        ) : (
          /* High-Fidelity Inline Vector Shield as 100% Guaranteed Fallback */
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
            <defs>
              <linearGradient id="shieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
              <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <path
              d="M 50 6 L 86 20 C 86 54 50 88 50 94 C 50 88 14 54 14 20 Z"
              fill="url(#shieldBg)"
              stroke="url(#goldStroke)"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="38" r="7" fill="#fbbf24" />
            <path
              d="M 50 45 L 50 68 M 38 56 L 62 56"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900">
            Genu<span className="text-amber-500 font-black">AI</span> <span className="font-bold text-slate-700">Technologies</span>
          </div>
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            Recruitment Intelligence
          </div>
        </div>
      )}
    </div>
  );
};

export default GenuAILogo;

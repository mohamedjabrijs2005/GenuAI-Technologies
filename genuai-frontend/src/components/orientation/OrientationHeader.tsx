import React from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface OrientationHeaderProps {
  currentStep: number;
  title: string;
}

export const stepsList = [
  { step: 1, title: 'Terms & Conditions', path: '/terms' },
  { step: 2, title: 'Privacy Policy', path: '/privacy' },
  { step: 3, title: 'Ecosystem Pricing', path: '/pricing' },
  { step: 4, title: 'Product Roadmap', path: '/roadmap' },
  { step: 5, title: 'Security Center', path: '/security' },
  { step: 6, title: 'Learning Hub', path: '/learning-hub' },
  { step: 7, title: 'Technology Stack', path: '/technology' },
];

export const OrientationHeader: React.FC<OrientationHeaderProps> = ({ currentStep, title }) => {
  const navigate = useNavigate();
  const progressPercent = Math.round((currentStep / 7) * 100);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Back to Home & Step Info */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-indigo-600" />
            <span>Home</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold font-mono">
              Step {currentStep} of 7
            </span>
            <span className="text-xs font-bold text-slate-900 hidden sm:inline">• {title}</span>
          </div>
        </div>

        {/* Center: Progress Bar & Dots */}
        <div className="flex flex-col items-center gap-1.5 w-full sm:w-80">
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
            <div
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
            <span>{progressPercent}% Complete</span>
            <span>•</span>
            <span>Guided Ecosystem Orientation</span>
          </div>
        </div>

        {/* Right: Quick Step Jump Pill */}
        <div className="hidden lg:flex items-center gap-1">
          {stepsList.map((s) => {
            const isDone = s.step < currentStep;
            const isCurrent = s.step === currentStep;

            return (
              <button
                key={s.step}
                onClick={() => navigate(s.path)}
                title={`${s.step}. ${s.title}`}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-xs scale-105 ring-2 ring-indigo-200'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-400 border border-slate-200/80 hover:bg-slate-200 hover:text-slate-600'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.step}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

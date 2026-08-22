import React from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface OrientationHeaderProps {
  currentStep: number;
  title: string;
}

export const stepsList = [
  { step: 1, title: 'Terms & Conditions', path: '/terms', short: 'Terms' },
  { step: 2, title: 'Privacy Policy', path: '/privacy', short: 'Privacy' },
  { step: 3, title: 'Ecosystem Pricing', path: '/pricing', short: 'Pricing' },
  { step: 4, title: 'Product Roadmap', path: '/roadmap', short: 'Roadmap' },
  { step: 5, title: 'Security Center', path: '/security', short: 'Security' },
  { step: 6, title: 'Learning Hub', path: '/learning-hub', short: 'Learning' },
  { step: 7, title: 'Role Agreements', path: '/agreements', short: 'Agreements' },
];

export const OrientationHeader: React.FC<OrientationHeaderProps> = ({ currentStep, title }) => {
  const navigate = useNavigate();
  const progressPercent = Math.round((currentStep / 7) * 100);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-[0_1px_4px_0_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row: back button + title + step badge */}
        <div className="flex items-center justify-between gap-4 h-14">
          {/* Left */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Back to Home</span>
          </button>

          {/* Center: current step title */}
          <div className="text-xs font-bold text-slate-900 text-center truncate">
            <span className="text-indigo-600">Step {currentStep} of 7</span>
            <span className="mx-2 text-slate-300">·</span>
            <span>{title}</span>
          </div>

          {/* Right: percent badge */}
          <div className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full shrink-0">
            {progressPercent}% done
          </div>
        </div>

        {/* Step dots row (visible on sm+) */}
        <div className="hidden sm:flex items-end gap-0 pb-0">
          {stepsList.map((s) => {
            const isDone = s.step < currentStep;
            const isCurrent = s.step === currentStep;
            const isFuture = s.step > currentStep;

            return (
              <button
                key={s.step}
                onClick={() => navigate(s.path)}
                title={s.title}
                className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 transition-all cursor-pointer group border-b-2 ${
                  isCurrent
                    ? 'border-indigo-600'
                    : isDone
                    ? 'border-emerald-400 hover:border-emerald-500'
                    : 'border-transparent hover:border-slate-200'
                }`}
              >
                <div className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${
                  isCurrent
                    ? 'text-indigo-600'
                    : isDone
                    ? 'text-emerald-600'
                    : 'text-slate-400 group-hover:text-slate-600'
                }`}>
                  {isDone ? <CheckCircle2 className="w-3 h-3 mx-auto" /> : s.step}
                </div>
                <div className={`text-[10px] font-semibold leading-tight truncate max-w-full transition-colors ${
                  isCurrent
                    ? 'text-indigo-700 font-bold'
                    : isDone
                    ? 'text-emerald-600'
                    : 'text-slate-400 group-hover:text-slate-600'
                }`}>
                  {s.short}
                </div>
              </button>
            );
          })}
        </div>

        {/* Full-width progress bar */}
        <div className="w-full h-0.5 bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-400 transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
};

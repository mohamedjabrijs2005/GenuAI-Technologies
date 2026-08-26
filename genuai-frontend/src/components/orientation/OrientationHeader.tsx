import React from 'react';
import { ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GenuAILogo } from '../common/GenuAILogo';

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
  { step: 6, title: 'Role Agreements', path: '/agreements', short: 'Agreements' },
];

export const OrientationHeader: React.FC<OrientationHeaderProps> = ({ currentStep, title }) => {
  const navigate = useNavigate();
  const totalSteps = stepsList.length;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  const isStepUnlocked = (stepNum: number) => {
    if (stepNum <= currentStep) return true;
    try {
      // Unlocked if the immediately preceding step has consent
      return sessionStorage.getItem(`genuai_orientation_step_${stepNum - 1}_consent`) === 'true';
    } catch {
      return false;
    }
  };

  const handleStepClick = (s: typeof stepsList[0]) => {
    if (!isStepUnlocked(s.step)) {
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    navigate(s.path);
  };

  const handleBackHome = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    navigate('/home');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_4px_0_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row: brand + back button + title + step badge */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 h-14">
          {/* Left: Brand Logo & Back link */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleBackHome();
              }}
              className="flex items-center gap-2 group cursor-pointer"
              title="GenuAI Technologies Home"
            >
              <GenuAILogo size="xs" />
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 tracking-tight hidden md:inline-block">
                Genu<span className="text-indigo-600">AI</span>
              </span>
            </a>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <button
              type="button"
              onClick={handleBackHome}
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Home</span>
            </button>
          </div>

          {/* Center: current step title */}
          <div className="text-xs font-bold text-slate-900 text-center truncate px-2">
            <span className="text-indigo-600 font-extrabold">Step {currentStep}/{totalSteps}</span>
            <span className="mx-1.5 text-slate-300">·</span>
            <span className="text-slate-800 font-bold">{title}</span>
          </div>

          {/* Right: percent badge */}
          <div className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full shrink-0">
            {progressPercent}% completed
          </div>
        </div>

        {/* Step dots row (visible on sm+) */}
        <div className="hidden sm:flex items-end gap-0 pb-0">
          {stepsList.map((s) => {
            const isDone = s.step < currentStep;
            const isCurrent = s.step === currentStep;
            const unlocked = isStepUnlocked(s.step);

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => handleStepClick(s)}
                disabled={!unlocked}
                title={unlocked ? s.title : `${s.title} (Complete previous step to unlock)`}
                className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 transition-all border-b-2 ${
                  isCurrent
                    ? 'border-indigo-600 cursor-default'
                    : isDone
                    ? 'border-emerald-400 hover:border-emerald-500 cursor-pointer'
                    : unlocked
                    ? 'border-slate-200 hover:border-slate-300 cursor-pointer'
                    : 'border-transparent opacity-40 cursor-not-allowed'
                }`}
              >
                <div className={`text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-0.5 transition-colors ${
                  isCurrent
                    ? 'text-indigo-600'
                    : isDone
                    ? 'text-emerald-600'
                    : 'text-slate-400'
                }`}>
                  {isDone ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ) : !unlocked ? (
                    <Lock className="w-2.5 h-2.5 text-slate-400" />
                  ) : (
                    s.step
                  )}
                </div>
                <div className={`text-[10px] font-semibold leading-tight truncate max-w-full transition-colors ${
                  isCurrent
                    ? 'text-indigo-700 font-bold'
                    : isDone
                    ? 'text-emerald-600'
                    : 'text-slate-500'
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
            className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface OrientationFooterProps {
  currentStep: number;
  pageTitle: string;
  nextPath: string;
  nextTitle: string;
}

export const OrientationFooter: React.FC<OrientationFooterProps> = ({
  currentStep,
  pageTitle,
  nextPath,
  nextTitle,
}) => {
  const navigate = useNavigate();
  const storageKey = `genuai_orientation_step_${currentStep}_consent`;
  // Start unchecked on each visit so the user must actively read and tick the box
  const [agreed, setAgreed] = useState<boolean>(false);

  useEffect(() => {
    // Reset agreed to false whenever the step changes
    setAgreed(false);
  }, [currentStep]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setAgreed(isChecked);
    try {
      if (isChecked) {
        sessionStorage.setItem(storageKey, 'true');
      } else {
        sessionStorage.removeItem(storageKey);
      }
    } catch {
      // ignore
    }
  };

  const isFinalStep = currentStep === 6;

  const handleNext = () => {
    if (!agreed) return;
    try {
      sessionStorage.setItem(storageKey, 'true');
    } catch {
      // ignore
    }
    // Instant reset to top so next page starts at the front/top, not in middle
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    navigate(nextPath);
  };

  return (
    <div className="mt-12">
      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
          Consent &amp; Acknowledgment Required
        </span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Consent card */}
      <div className="bg-white rounded-3xl border-2 border-indigo-100 shadow-sm overflow-hidden transition-all">
        {/* Card top strip */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 px-6 sm:px-8 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-100 shrink-0" />
            <div>
              <div className="text-xs font-black text-white uppercase tracking-widest">
                Step {currentStep} of 6 — Required Policy Confirmation
              </div>
              <div className="text-[11px] text-indigo-200 font-normal mt-0.5">
                Please review this section and check the confirmation box below to continue.
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-xs shrink-0 hidden sm:inline-block">
            {agreed ? 'Verified' : 'Action Required'}
          </span>
        </div>

        {/* Card body */}
        <div className="px-6 sm:px-8 py-6 space-y-6">
          {/* Checkbox row */}
          <label
            htmlFor={`consent-checkbox-${currentStep}`}
            className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
              agreed
                ? 'border-emerald-300 bg-emerald-50/40'
                : 'border-slate-200 bg-slate-50/80 hover:border-indigo-300 hover:bg-indigo-50/30'
            }`}
          >
            <div className="relative mt-0.5 shrink-0">
              <input
                id={`consent-checkbox-${currentStep}`}
                type="checkbox"
                checked={agreed}
                onChange={handleCheckboxChange}
                className="peer sr-only"
              />
              {/* Custom styled checkbox */}
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  agreed
                    ? 'bg-emerald-600 border-emerald-600 shadow-xs'
                    : 'bg-white border-slate-300 peer-hover:border-indigo-500'
                }`}
              >
                {agreed ? (
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                I have carefully read and understood the <strong className="text-slate-900 font-bold">{pageTitle}</strong> policies, and I agree to abide by all operational terms and evaluation standards.
              </p>
              <span className="text-[11px] text-slate-500 block">
                {agreed
                  ? '✓ Thank you! Your agreement is recorded for this session.'
                  : 'Click the checkbox above after reading to unlock the next step.'}
              </span>
            </div>
          </label>

          {/* Status + CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
            {/* Status message */}
            <div className="text-sm text-center sm:text-left">
              {agreed ? (
                <span className="flex items-center gap-2 text-emerald-700 font-semibold text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Agreement confirmed — you may proceed to the next step.</span>
                </span>
              ) : (
                <span className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Please check the confirmation box above to enable the continue button.</span>
                </span>
              )}
            </div>

            {/* CTA button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={!agreed}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                agreed
                  ? isFinalStep
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer'
                  : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>
                {isFinalStep
                  ? 'Complete Orientation & Proceed to Sign In'
                  : `Continue to ${nextTitle}`}
              </span>
              <ArrowRight className={`w-4 h-4 transition-transform ${agreed ? 'group-hover:translate-x-1' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

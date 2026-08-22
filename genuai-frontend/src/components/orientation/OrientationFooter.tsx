import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
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
  const [agreed, setAgreed] = useState(false);
  const isFinalStep = currentStep === 7;

  const handleNext = () => {
    if (!agreed) return;
    sessionStorage.setItem(`genuai_orientation_step_${currentStep}_consent`, 'true');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(nextPath);
  };

  return (
    <div className="mt-10">
      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
          Consent Required
        </span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Consent card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Card top strip */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 sm:px-8 py-4 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-100 shrink-0" />
          <div>
            <div className="text-xs font-black text-white uppercase tracking-widest">
              Step {currentStep} of 7 — Required Acknowledgement
            </div>
            <div className="text-[11px] text-indigo-200 font-normal mt-0.5">
              You must confirm before advancing to the next section.
            </div>
          </div>
        </div>

        {/* Card body */}
        <div className="px-6 sm:px-8 py-6 space-y-6">
          {/* Checkbox row */}
          <label
            htmlFor={`consent-checkbox-${currentStep}`}
            className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/60 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
          >
            <div className="relative mt-0.5 shrink-0">
              <input
                id={`consent-checkbox-${currentStep}`}
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="peer sr-only"
              />
              {/* Custom checkbox */}
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                agreed
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'bg-white border-slate-300 peer-hover:border-indigo-400'
              }`}>
                {agreed && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              I have carefully read and understood the <strong className="text-slate-900 font-bold">{pageTitle}</strong> policies and I agree to abide by all terms and operational guidelines as set out in this document.
            </p>
          </label>

          {/* Status + CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Status message */}
            <div className="text-sm text-center sm:text-left">
              {agreed ? (
                <span className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Consent confirmed — you may proceed.
                </span>
              ) : (
                <span className="text-slate-400 text-xs font-medium">
                  Check the box above to enable the continue button.
                </span>
              )}
            </div>

            {/* CTA button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={!agreed}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm transition-all ${
                agreed
                  ? isFinalStep
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer'
                  : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>
                {isFinalStep
                  ? 'Complete Orientation & Sign In'
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

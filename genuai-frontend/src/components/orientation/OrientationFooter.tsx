import React, { useState } from 'react';
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
  const [agreed, setAgreed] = useState(false);
  const isFinalStep = currentStep === 7;

  const handleNext = () => {
    if (agreed) {
      // Save consent to session storage
      sessionStorage.setItem(`genuai_orientation_step_${currentStep}_consent`, 'true');
      navigate(nextPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-12 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-900">Required Step Consent • Step {currentStep} of 7</div>
            <div className="text-[11px] text-slate-500 font-normal">
              Please acknowledge reading {pageTitle} before advancing to the next section.
            </div>
          </div>
        </div>

        <div className="text-xs font-mono text-indigo-600 font-bold px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 shrink-0">
          Step {currentStep} / 7
        </div>
      </div>

      {/* Checkbox Acknowledgment */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer" onClick={() => setAgreed(!agreed)}>
        <input
          type="checkbox"
          id={`consent-checkbox-step-${currentStep}`}
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer accent-indigo-600 shrink-0"
        />
        <label htmlFor={`consent-checkbox-step-${currentStep}`} className="text-xs text-slate-700 leading-relaxed font-medium cursor-pointer">
          I have thoroughly reviewed and agree to the <strong className="text-slate-900 font-bold">{pageTitle}</strong> policies and operational guidelines.
        </label>
      </div>

      {/* Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-[11px] text-slate-500 font-normal text-center sm:text-left">
          {agreed ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Consent confirmed. You may proceed.</span>
            </span>
          ) : (
            <span className="text-slate-400">Check the agreement box above to activate the continue button.</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={!agreed}
          className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
            agreed
              ? isFinalStep
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-[0.99]'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-[0.99]'
              : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed opacity-70'
          }`}
        >
          <span>{isFinalStep ? 'Complete Orientation & Proceed to Login' : `Continue to ${nextTitle}`}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

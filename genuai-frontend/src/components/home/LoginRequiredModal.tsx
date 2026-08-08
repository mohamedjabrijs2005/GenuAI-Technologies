import React, { useEffect } from 'react';
import { X, ArrowRight, ShieldCheck, UserCheck, Building2, Cpu, Sparkles } from 'lucide-react';

export interface ProtectedActionConfig {
  intent?: 'candidate' | 'company' | 'genuai' | 'admin' | string;
  title?: string;
  description?: string;
}

interface Props {
  isOpen: boolean;
  config: ProtectedActionConfig | null;
  onClose: () => void;
  onLoginRegister: (intent?: string) => void;
}

export const LoginRequiredModal: React.FC<Props> = ({
  isOpen,
  config,
  onClose,
  onLoginRegister,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !config) return null;

  const intent = config.intent || 'candidate';
  const heading = config.title || 'Ready to enter GenuAI?';
  const description = config.description || 'Create an account or sign in to access this GenuAI feature.';

  const getIntentBadge = () => {
    if (intent === 'company') {
      return {
        label: 'Company Ecosystem',
        icon: Building2,
        badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20',
      };
    }
    if (intent === 'genuai' || intent === 'admin') {
      return {
        label: 'GenuAI Governance',
        icon: Cpu,
        badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-500/20',
      };
    }
    return {
      label: 'Candidate Ecosystem',
      icon: UserCheck,
      badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-500/20',
    };
  };

  const badge = getIntentBadge();
  const BadgeIcon = badge.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-[fadeIn_0.2s_ease]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-white text-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl shadow-slate-950/40 p-6 sm:p-8 text-left transition-all animate-[scaleUp_0.2s_ease] ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Intent / Feature Badge */}
        <div className="flex items-center gap-2 mb-3.5">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-xs ${badge.badgeStyle}`}>
            <BadgeIcon className="w-3.5 h-3.5 shrink-0" />
            <span>{badge.label}</span>
          </div>
        </div>

        {/* Modal Heading - Ultra bright and high-contrast */}
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 leading-tight tracking-tight">
          {heading}
        </h3>

        {/* Modal Description - Crisp, crystal clear slate-600 */}
        <p className="text-sm sm:text-base font-medium text-slate-600 leading-relaxed mb-6">
          {description}
        </p>

        {/* Modal Action Buttons */}
        <div className="space-y-3">
          {/* 1. Login / Register Button */}
          <button
            onClick={() => onLoginRegister(intent)}
            className="w-full rounded-xl py-3.5 px-4 font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Login / Register</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* 2. Continue Exploring Button */}
          <button
            onClick={onClose}
            className="w-full rounded-xl py-3 px-4 font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <span>Continue Exploring</span>
          </button>
        </div>

        {/* Safe notice footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Free public exploration • OAuth single sign-on</span>
        </div>
      </div>
    </div>
  );
};

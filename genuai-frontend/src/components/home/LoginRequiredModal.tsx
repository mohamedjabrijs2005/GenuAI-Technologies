import React, { useEffect } from 'react';
import { X, ArrowRight, ShieldCheck, UserCheck, Building2, Cpu } from 'lucide-react';

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
        color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
      };
    }
    if (intent === 'genuai' || intent === 'admin') {
      return {
        label: 'GenuAI Ecosystem',
        icon: Cpu,
        color: 'text-purple-600 bg-purple-500/10 border-purple-500/20',
      };
    }
    return {
      label: 'Candidate Ecosystem',
      icon: UserCheck,
      color: 'text-indigo-brand bg-indigo-brand/10 border-indigo-brand/20',
    };
  };

  const badge = getIntentBadge();
  const BadgeIcon = badge.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-[fadeIn_0.2s_ease]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-surface/98 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-surface-container shadow-2xl p-6 sm:p-8 text-left transition-all animate-[scaleUp_0.2s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Intent / Feature Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${badge.color}`}>
            <BadgeIcon className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </div>
        </div>

        {/* Modal Heading */}
        <h3 className="text-xl sm:text-2xl font-bold text-on-surface mb-2 leading-tight">
          {heading}
        </h3>

        {/* Modal Description */}
        <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-6">
          {description}
        </p>

        {/* Modal Action Buttons */}
        <div className="space-y-3">
          {/* 1. Login / Register Button */}
          <button
            onClick={() => onLoginRegister(intent)}
            className="w-full rounded-xl py-3 px-4 font-semibold text-sm text-white bg-gradient-to-r from-indigo-brand to-[#7C3AED] hover:shadow-lg hover:shadow-indigo-brand/25 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>Login / Register</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* 2. Continue Exploring Button */}
          <button
            onClick={onClose}
            className="w-full rounded-xl py-3 px-4 font-semibold text-sm text-on-surface bg-surface-bright border border-surface-container hover:bg-surface-container hover:border-surface-container-high transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue Exploring</span>
          </button>
        </div>

        {/* Safe notice */}
        <div className="mt-5 pt-4 border-t border-surface-container/60 flex items-center justify-center gap-1.5 text-[11px] text-on-surface-variant/70">
          <ShieldCheck className="w-3.5 h-3.5 text-success" />
          <span>Free public exploration • OAuth single sign-on</span>
        </div>
      </div>
    </div>
  );
};

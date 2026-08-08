import React from 'react';
import { Check, Building2, UserCheck, School, ArrowRight, Sparkles, Gauge } from 'lucide-react';
import { ProtectedActionConfig } from './LoginRequiredModal';

export interface SubscriptionPlan {
  id: string;
  category: 'candidate' | 'company' | 'institution';
  title: string;
  badge?: string;
  description: string;
  priceLabel: string;
  priceSub: string;
  features: { text: string; isRateLimit?: boolean }[];
  ctaText: string;
  intent: string;
  theme: {
    iconBg: string;
    badgeStyle: string;
    cardBorder: string;
    buttonStyle: string;
  };
  recommended?: boolean;
}

// Centralized subscription & fair usage configuration object
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'candidate-plan',
    category: 'candidate',
    title: 'GenuAI Candidate',
    badge: 'Skill Freedom',
    description: 'For students and developers building verified credentials and unlocking multi-company opportunities.',
    priceLabel: 'Skill Passport',
    priceSub: 'One standardized assessment accepted across all partner employers',
    theme: {
      iconBg: 'bg-blue-600 text-white shadow-md shadow-blue-600/25',
      badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/20',
      cardBorder: 'border-blue-200/80 hover:border-blue-500/60 bg-gradient-to-b from-white to-blue-50/20 shadow-md',
      buttonStyle: 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/25',
    },
    features: [
      { text: 'Profile & Automated Resume AI Parsing' },
      { text: 'Unlimited Coding IDE & DSA Practice Sandbox', isRateLimit: true },
      { text: '1 Official Verified Assessment / 30-Day Cooldown', isRateLimit: true },
      { text: 'One Assessment → Multiple Company Opportunities' },
      { text: 'Continuous Biometric Proctoring & AI Trust Score' },
      { text: 'Verifiable Skill Credential Valid for 12 Months' },
    ],
    ctaText: 'Explore Candidate Plan',
    intent: 'candidate',
    recommended: false,
  },
  {
    id: 'company-plan',
    category: 'company',
    title: 'GenuAI Recruiter',
    badge: 'Zero Retest Overhead',
    description: 'For organizations seeking authenticated, pre-evaluated talent with zero test infrastructure costs.',
    priceLabel: 'Enterprise Hiring',
    priceSub: 'Standardized talent scorecards and calibrated hiring analytics',
    theme: {
      iconBg: 'bg-purple-600 text-white shadow-md shadow-purple-600/25',
      badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-500/20',
      cardBorder: 'border-purple-300 ring-2 ring-purple-500/20 bg-gradient-to-b from-white to-purple-50/30 shadow-xl -translate-y-1 sm:-translate-y-2',
      buttonStyle: 'text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-purple-600/30',
    },
    features: [
      { text: 'Job Posting & Automated Role Criteria Mapping' },
      { text: '500 Candidate Dispatches / min ATS API Quota', isRateLimit: true },
      { text: '10,000 Parallel AI-Proctored Live Sessions', isRateLimit: true },
      { text: 'Full 8-Module Standardized Assessment Access' },
      { text: 'AI Technical Interview & Group Discussion Records' },
      { text: 'Anti-Proxy Biometric Verification & Audit Logs' },
      { text: 'Predictive Hiring Analytics & Cohort Benchmarks' },
    ],
    ctaText: 'Explore Company Plan',
    intent: 'company',
    recommended: true,
  },
  {
    id: 'institution-plan',
    category: 'institution',
    title: 'GenuAI Institution',
    badge: 'Campus Governance',
    description: 'For colleges and universities supporting students with structured skill development and campus drives.',
    priceLabel: 'Campus Scale',
    priceSub: 'Complete placement cell governance and cohort telemetry',
    theme: {
      iconBg: 'bg-amber-600 text-white shadow-md shadow-amber-600/25',
      badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200 ring-1 ring-amber-500/20',
      cardBorder: 'border-amber-200/80 hover:border-amber-500/60 bg-gradient-to-b from-white to-amber-50/20 shadow-md',
      buttonStyle: 'text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-md shadow-amber-600/25',
    },
    features: [
      { text: 'Candidate Batch & Department Management' },
      { text: '5,000 Concurrent Campus Placement Test Seats', isRateLimit: true },
      { text: '2.5s Real-Time Placement Cell Telemetry Sync', isRateLimit: true },
      { text: 'Institutional Assessment & Skill Programs' },
      { text: 'Multilingual Practice Modules & Voice Coaching' },
      { text: 'Direct Partner Employer Dispatch Console' },
      { text: 'Institution Governance & Compliance Dashboard' },
    ],
    ctaText: 'Explore Institution Plan',
    intent: 'institution',
    recommended: false,
  },
];

interface Props {
  onProtectedAction?: (config: ProtectedActionConfig) => void;
}

export const SubscriptionPricing: React.FC<Props> = ({ onProtectedAction }) => {
  const handlePlanClick = (plan: SubscriptionPlan) => {
    if (onProtectedAction) {
      onProtectedAction({
        intent: `subscription&plan=${plan.category}`,
        title: `Ready to explore ${plan.title}?`,
        description: `Sign in or create an account to access ${plan.title} features. ${plan.description}`,
      });
    }
  };

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-24 bg-surface-bright/40 border-t border-b border-surface-container/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-indigo-brand/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tailored Ecosystem Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-on-surface mb-3 sm:mb-4 leading-tight">
            Choose the GenuAI Experience That Fits You
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
            Flexible access for candidates, companies, and institutions with calibrated quotas and anti-abuse safeguards engineered for scale.
          </p>
        </div>

        {/* 3 Distinct Vibrant Plan Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-8 sm:mb-10">
          {subscriptionPlans.map((plan) => {
            const Icon = plan.category === 'candidate' ? UserCheck : plan.category === 'company' ? Building2 : School;
            const { iconBg, badgeStyle, cardBorder, buttonStyle } = plan.theme;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 border transition-all duration-300 flex flex-col justify-between relative group ${cardBorder}`}
              >
                <div>
                  {/* Top Badge & Domain Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold ${iconBg}`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    {plan.badge && (
                      <span className={`text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${badgeStyle}`}>
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  {/* Plan Title */}
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1.5 leading-tight">
                    {plan.title}
                  </h3>

                  {/* Plan Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {plan.description}
                  </p>

                  {/* Pricing Overview */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs mb-5">
                    <div className="text-base sm:text-lg font-black text-slate-900">
                      {plan.priceLabel}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                      {plan.priceSub}
                    </div>
                  </div>

                  {/* Feature & Quota Checklist */}
                  <div className="space-y-2.5 mb-6 sm:mb-8">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Included Capabilities &amp; Quotas:
                    </div>
                    {plan.features.map((feat) => (
                      <div key={feat.text} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                        {feat.isRateLimit ? (
                          <Gauge className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        ) : (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                        <span className={`leading-snug ${feat.isRateLimit ? 'font-semibold text-slate-900' : ''}`}>
                          {feat.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Action CTA */}
                <div>
                  <button
                    onClick={() => handlePlanClick(plan)}
                    className={`w-full py-3 sm:py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] ${buttonStyle}`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="mt-2.5 text-center text-[10px] text-slate-400 font-medium">
                    Authentication required to access plan tools
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clean, Subtle Platform Notice */}
        <div className="text-center text-[11px] text-slate-500 max-w-xl mx-auto font-medium">
          Subscription checkout integration coming soon. All demo features and assessments can be experienced through account login.
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Check, ShieldCheck, Sparkles, Building2, UserCheck, School, ArrowRight, Lock } from 'lucide-react';
import { ProtectedActionConfig } from './LoginRequiredModal';

export interface SubscriptionPlan {
  id: string;
  category: 'candidate' | 'company' | 'institution';
  title: string;
  badge?: string;
  description: string;
  priceLabel: string;
  priceSub: string;
  features: string[];
  ctaText: string;
  intent: string;
  recommended?: boolean;
}

// Centralized subscription configuration object (pricing can be modified from this single source)
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'candidate-plan',
    category: 'candidate',
    title: 'GenuAI Candidate',
    badge: 'Skill Freedom',
    description: 'For students and professionals building verified skills and discovering opportunities.',
    priceLabel: 'Skill Passport',
    priceSub: 'One assessment recognized across participating employers',
    features: [
      'Profile & AI Resume Parsing',
      'Practice Assessments & Live Coding IDE',
      'Skill Development & GD Practice Simulator',
      'One Assessment → Multiple Company Opportunities',
      'Verified Assessment Profile & AI Trust Score',
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
    description: 'For organizations looking to evaluate and hire verified talent without infrastructure overhead.',
    priceLabel: 'Enterprise Hiring',
    priceSub: 'Standardized scorecards and calibrated recruitment intelligence',
    features: [
      'Job Posting & Role Mapping',
      'Candidate Assessment Suite Access',
      'AI Resume Screening & Keyword Match',
      'Coding & Real-World Skill Evaluation',
      'GD & AI Interview Support Records',
      'Recruitment Intelligence & Analytics',
      'Continuous Anti-Proxy Candidate Verification',
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
    description: 'For colleges and institutions supporting students with structured skill development and recruitment.',
    priceLabel: 'Campus Scale',
    priceSub: 'Complete placement cell oversight and cohort telemetry',
    features: [
      'Candidate Batch & Student Management',
      'Institutional Assessment Programs',
      'Skill Analytics & Department Benchmarks',
      'Campus Recruitment Support & Employer Dispatch',
      'Institution Governance Dashboard',
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
            <span>Tailored Platform Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-on-surface mb-3 sm:mb-4 leading-tight">
            Choose the GenuAI Experience That Fits You
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed">
            Flexible access for candidates, companies, and institutions. One standardized ecosystem designed to eliminate recruitment waste.
          </p>
        </div>

        {/* 3 Subscription Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-10 sm:mb-12">
          {subscriptionPlans.map((plan) => {
            const isRecruiter = plan.recommended;
            const Icon = plan.category === 'candidate' ? UserCheck : plan.category === 'company' ? Building2 : School;

            return (
              <div
                key={plan.id}
                className={`glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-between relative group ${
                  isRecruiter
                    ? 'border-indigo-brand ring-2 ring-indigo-brand/25 bg-surface-bright shadow-xl -translate-y-1'
                    : 'border-surface-container hover:border-surface-container-high hover:shadow-lg'
                }`}
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                      isRecruiter
                        ? 'bg-indigo-brand text-white shadow-md'
                        : 'bg-surface-container text-indigo-brand'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {plan.badge && (
                      <span className="text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full bg-indigo-brand/10 text-indigo-brand border border-indigo-brand/20 uppercase tracking-wider">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  {/* Plan Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-on-surface mb-2">
                    {plan.title}
                  </h3>

                  {/* Plan Description */}
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  {/* Pricing Overview */}
                  <div className="p-4 rounded-2xl bg-surface border border-surface-container/70 mb-6">
                    <div className="text-base sm:text-lg font-black text-on-surface">
                      {plan.priceLabel}
                    </div>
                    <div className="text-[11px] text-on-surface-variant mt-0.5">
                      {plan.priceSub}
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 mb-8">
                    <div className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                      Included Capabilities:
                    </div>
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs text-on-surface-variant">
                        <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Action CTA */}
                <div>
                  <button
                    onClick={() => handlePlanClick(plan)}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                      isRecruiter
                        ? 'text-white bg-gradient-to-r from-indigo-brand to-indigo-brand-dark hover:shadow-lg hover:shadow-indigo-brand/30'
                        : 'text-on-surface bg-surface border border-surface-container hover:bg-surface-bright hover:border-surface-container-high'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="mt-3 text-center text-[10px] text-on-surface-variant/70">
                    Authentication required to access plan tools
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Honest Checkout Notice */}
        <div className="p-4 rounded-2xl bg-surface border border-surface-container flex items-center justify-center gap-2 max-w-2xl mx-auto text-xs text-on-surface-variant text-center">
          <Lock className="w-4 h-4 text-indigo-brand shrink-0" />
          <span>
            <strong>Payment &amp; Billing Notice:</strong> Subscription checkout integration coming soon. All demo features and assessments can be experienced through account login.
          </span>
        </div>
      </div>
    </section>
  );
};

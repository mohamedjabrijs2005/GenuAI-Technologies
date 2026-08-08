import React from 'react';
import { Check, ShieldCheck, Sparkles, Building2, UserCheck, School, ArrowRight, Lock, Gauge, Zap, Activity, Clock, ShieldAlert, Cpu } from 'lucide-react';
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
  rateLimits: { label: string; value: string; desc: string }[];
  ctaText: string;
  intent: string;
  theme: {
    iconBg: string;
    badgeStyle: string;
    cardBorder: string;
    buttonStyle: string;
    rateLimitHeader: string;
  };
  recommended?: boolean;
}

// Centralized subscription & rate limiting configuration object
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'candidate-plan',
    category: 'candidate',
    title: 'GenuAI Candidate',
    badge: 'Skill Freedom',
    description: 'For students and developers building verified skills and discovering opportunities.',
    priceLabel: 'Skill Passport',
    priceSub: 'One assessment recognized across participating employers',
    theme: {
      iconBg: 'bg-blue-600 text-white shadow-md shadow-blue-600/25',
      badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/20',
      cardBorder: 'border-blue-200/80 hover:border-blue-500/60 bg-gradient-to-b from-white to-blue-50/20 shadow-lg shadow-blue-950/5',
      buttonStyle: 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/25 hover:shadow-blue-600/40',
      rateLimitHeader: 'text-blue-700 bg-blue-50/80 border-blue-200/60',
    },
    features: [
      'Profile & AI Resume Parsing',
      'Practice Assessments & Live Coding IDE',
      'Skill Development & GD Practice Simulator',
      'One Assessment → Multiple Company Opportunities',
      'Verified Assessment Profile & AI Trust Score',
    ],
    rateLimits: [
      { label: 'Official Assessment', value: '1 Test / 30 Days', desc: 'Anti-memorization cooldown ensures authentic skill measurement' },
      { label: 'Practice Sandbox', value: 'Unlimited Runs', desc: 'No rate caps on self-paced coding and mock interview practice' },
      { label: 'Biometric Heartbeat', value: '60 pings / min', desc: 'Continuous on-device telemetry and anti-proxy verification' },
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
    theme: {
      iconBg: 'bg-purple-600 text-white shadow-md shadow-purple-600/25',
      badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-500/20',
      cardBorder: 'border-purple-300 ring-2 ring-purple-500/20 bg-gradient-to-b from-white to-purple-50/30 shadow-xl shadow-purple-950/10 -translate-y-1 sm:-translate-y-2',
      buttonStyle: 'text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-purple-600/30 hover:shadow-purple-600/45',
      rateLimitHeader: 'text-purple-700 bg-purple-50/80 border-purple-200/60',
    },
    features: [
      'Job Posting & Role Mapping',
      'Candidate Assessment Suite Access',
      'AI Resume Screening & Keyword Match',
      'Coding & Real-World Skill Evaluation',
      'GD & AI Interview Support Records',
      'Recruitment Intelligence & Analytics',
      'Continuous Anti-Proxy Candidate Verification',
    ],
    rateLimits: [
      { label: 'Talent Dispatch API', value: '500 Profiles / min', desc: 'Token-bucket rate limiter for ATS automated synchronization' },
      { label: 'Concurrent Testing', value: '10,000 Live Sessions', desc: 'High-throughput auto-scaling without candidate queue lag' },
      { label: 'Webhook Ingestion', value: '1,200 events / min', desc: 'Instant cryptographic proctoring and score audit streaming' },
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
    theme: {
      iconBg: 'bg-amber-600 text-white shadow-md shadow-amber-600/25',
      badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200 ring-1 ring-amber-500/20',
      cardBorder: 'border-amber-200/80 hover:border-amber-500/60 bg-gradient-to-b from-white to-amber-50/20 shadow-lg shadow-amber-950/5',
      buttonStyle: 'text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-md shadow-amber-600/25 hover:shadow-amber-600/40',
      rateLimitHeader: 'text-amber-800 bg-amber-50/80 border-amber-200/60',
    },
    features: [
      'Candidate Batch & Student Management',
      'Institutional Assessment Programs',
      'Skill Analytics & Department Benchmarks',
      'Campus Recruitment Support & Employer Dispatch',
      'Institution Governance Dashboard',
    ],
    rateLimits: [
      { label: 'Campus Drive Concurrency', value: '5,000 Seats / Batch', desc: 'Guaranteed burst bandwidth during peak campus placement hours' },
      { label: 'Cohort Telemetry Sync', value: '2.5s Real-Time', desc: 'Live departmental score updates and proctoring status flags' },
      { label: 'Edge Video Compression', value: '85% Bandwidth Saved', desc: 'Local AI processing eliminates campus network congestion' },
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
            Flexible access for candidates, companies, and institutions. Calibrated rate limits, concurrency controls, and anti-abuse safeguards engineered for scale.
          </p>
        </div>

        {/* 3 Distinct Vibrant Plan Cards with Rate Limiting Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-10 sm:mb-12">
          {subscriptionPlans.map((plan) => {
            const Icon = plan.category === 'candidate' ? UserCheck : plan.category === 'company' ? Building2 : School;
            const { iconBg, badgeStyle, cardBorder, buttonStyle, rateLimitHeader } = plan.theme;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-between relative group ${cardBorder}`}
              >
                <div>
                  {/* Top Badge & Domain Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${iconBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {plan.badge && (
                      <span className={`text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${badgeStyle}`}>
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  {/* Plan Title */}
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                    {plan.title}
                  </h3>

                  {/* Plan Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                    {plan.description}
                  </p>

                  {/* Pricing Overview */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs mb-5">
                    <div className="text-base sm:text-lg font-black text-slate-900">
                      {plan.priceLabel}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                      {plan.priceSub}
                    </div>
                  </div>

                  {/* Rate Limiting & Concurrency Quota Box */}
                  <div className="mb-6 rounded-2xl border p-3.5 bg-white shadow-xs">
                    <div className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border mb-2.5 flex items-center gap-1.5 ${rateLimitHeader}`}>
                      <Gauge className="w-3.5 h-3.5 shrink-0" />
                      <span>Rate Limits &amp; System Quotas</span>
                    </div>
                    <div className="space-y-2">
                      {plan.rateLimits.map((rl) => (
                        <div key={rl.label} className="text-xs border-b border-slate-100 last:border-b-0 pb-1.5 last:pb-0">
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>{rl.label}</span>
                            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                              {rl.value}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                            {rl.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2 mb-8">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Included Capabilities:
                    </div>
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Action CTA */}
                <div>
                  <button
                    onClick={() => handlePlanClick(plan)}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] ${buttonStyle}`}
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

        {/* Global Rate Limiting & Anti-Abuse Safeguard Banner */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-md max-w-4xl mx-auto text-xs text-slate-600">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>GenuAI Token-Bucket Rate Limiter &amp; DDoS Safeguard</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              RFC 6585 Compliance Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px] leading-relaxed">
            <div>
              <strong className="text-slate-800 block mb-0.5">🔒 Auth &amp; OTP Brute-Force Limits:</strong>
              Max 5 OTP attempts per 15-minute window per IP to prevent credential stuffing.
            </div>
            <div>
              <strong className="text-slate-800 block mb-0.5">⚡ WebSocket Proctoring Burst:</strong>
              Dynamic rate throttling adapts to network packet loss without terminating valid sessions.
            </div>
            <div>
              <strong className="text-slate-800 block mb-0.5">💳 Transparent Payment Integration:</strong>
              Subscription checkout integration coming soon. No fake payments or simulated deductions.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
